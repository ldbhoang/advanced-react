import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import PaginationStyle from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error}) => {
      if (loading) return <p>Loading...</p>;
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      const page = props.page;
      return (
        <PaginationStyle>
          <Head>
            <title>
              Blabla! - Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefect
            href={{
              pathname: 'items',
              query: { page: page - 1 }
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>Prev</a>
          </Link>
          <p>Page {page} of {pages}</p>
          <Link
            prefect
            href={{
              pathname: 'items',
              query: { page: page + 1 }
            }}
          >
            <a className="prev" aria-disabled={page + 1 > pages}>Next</a>
          </Link>
        </PaginationStyle>
      )
    }}
  </Query>
);

export default Pagination;