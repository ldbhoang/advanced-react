import React, { Component } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Title from './styles/Title';
import ItemStyle from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';

class Item extends Component {
  render() {
    const { item } = this.props;
    return (
      <ItemStyle>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link href={{
            pathname: '/item',
            query: {
              id: item.id
            }
          }}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>

        <div className="buttonList">
          <Link href={{
            pathname: 'update',
            query: {
              id: item.id
            }
          }}>
            <a>Edit </a>
          </Link>
          <button id={item.id}>Add to card </button>
          <DeleteItem id={item.id}>Delete</DeleteItem>
        </div>
      </ItemStyle>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
