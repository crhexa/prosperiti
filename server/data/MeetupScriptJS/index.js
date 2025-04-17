require('dotenv').config();
const { ApolloClient } = require('@apollo/client/core');
const { InMemoryCache } = require('@apollo/client/cache');
const { HttpLink } = require('@apollo/client/link/http');
const fetch = require('cross-fetch');
const gql = require('graphql-tag');

// Create an HTTP link to the Meetup GraphQL API
const httpLink = new HttpLink({
  uri: 'https://api.meetup.com/gql-ext',
  fetch,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.MEETUP_API_TOKEN}`
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const SEARCH_EVENTS = gql`
  query($lat: Float!, $lon: Float!, $query: String!) {
    eventSearch(filter: { lat: $lat, lon: $lon, query: $query }, first: 10) {
      totalCount
      pageInfo {
        endCursor
      }
      edges {
        node {
          id
          title
          description
          dateTime
          eventUrl
          group {
            name
            urlname
          }
        }
      }
    }
  }
`;

// function to search for events
async function searchEvents(searchTerm) {
  try {
    // NYC as the default
    const latitude = 40.7128;
    const longitude = -74.0060;

    // change this for whatever u want leave the nyc above as default
    // const latitude = 38.6270;
    // const longitude = -90.1994;
    
    console.log(`Searching for "${searchTerm}" events near coordinates (${latitude}, ${longitude})...`);
    
    const result = await client.query({
      query: SEARCH_EVENTS,
      variables: { 
        lat: latitude,
        lon: longitude,
        query: searchTerm
      }
    });
    
    const events = result.data.eventSearch;
    console.log(`Found ${events.totalCount} events matching "${searchTerm}"`);
    
    if (events.edges.length > 0) {
      console.log("\nEvents found:");
      events.edges.forEach(({ node }) => {
        console.log(`- ${node.title}`);
        console.log(`  Date: ${new Date(node.dateTime).toLocaleString()}`);
        console.log(`  Group: ${node.group.name}`);
        console.log(`  URL: ${node.eventUrl}`);
        

        console.log('');
      });
    } else {
      console.log("No events matched your search criteria.");
    }
    
  } catch (error) {
    console.error('Error searching events:', error);
    if (error.graphQLErrors) {
      console.log('GraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
    }
  }
}

const searchTerm = "sports"; // change to whatever u want
searchEvents(searchTerm);