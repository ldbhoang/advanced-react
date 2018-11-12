import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import { SINGLE_ITEM_QUERY } from './UpdateItem';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .detail {
    margin: 3rem;
    font-size: 2rem;
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query variables={{id: this.props.id}} query={SINGLE_ITEM_QUERY}>
        {({ data, error, loading }) => {
          console.log(data);
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>Item not found!!!</p>;
          const { item } = data;
          return (
            <SingleItemStyles>
              <Head>
                <title>Blabla | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="detail">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;
