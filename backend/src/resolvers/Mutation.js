const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../mail');

const Mutations = {
  async createItem (parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = {...args};
    delete updates.id;
    const item = await ctx.db.mutation.updateItem({
      data: {
        ...updates
      },
      where: {
        id: args.id
      }
    }, info);
    return item;
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    const res = await ctx.db.mutation.deleteItem({ where }, info);
    return res;
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] },
      }
    }, info);

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set cookie on response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        email,
      }
    });
    if (!user) {
      throw new Error(`User: ${email} not found`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Wrong password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Good bye!!!' };
  },
  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        email: args.email
      }
    });
    if (!user) {
      throw new Error(`User: ${args.email} not found`);
    }

    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    const mailRes = await transport.sendMail({
      from: 'ldbhoang@gmail.com',
      to: user.email,
      subject: 'Password reset token',
      html: makeANiceEmail(`Click here to reset: \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Reset</a>`),
    });

    console.log(mailRes);

    return { message: 'Thank you' };
  },
  async resetPassword(parent, args, ctx, info) {
    const { password, confirmPassword, resetToken } = args;
    if (password !== confirmPassword) throw new Error('Password not match');
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) throw new Error('Token invalid or expired');

    const newPassword = await bcrypt.hash(password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email,
      },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    });
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return updatedUser;
  }
};

module.exports = Mutations;
