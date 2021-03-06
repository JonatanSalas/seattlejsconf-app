import React from "react";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { Font } from "expo";
import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import { offline } from "redux-offline";
import config from "redux-offline/lib/defaults";

import { component as Root } from "./lib/js/re/root";

console.ignoredYellowBox = [
  "Warning: View.propTypes has been deprecated and will be removed in a future version of ReactNative. Use ViewPropTypes instead."
];

const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/cj5cm0t4pnljk01087tv4g61a`
});

const client = new ApolloClient({
  networkInterface
});

const store = createStore(
  combineReducers({ apollo: client.reducer() }),
  undefined,
  compose(applyMiddleware(client.middleware()), offline(config))
);

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      "open-sans": require("./static/OpenSans-Regular.ttf"),
      "open-sans-bold": require("./static/OpenSans-Bold.ttf"),
      montserrat: require("./static/Montserrat-Regular.ttf"),
      "montserrat-bold": require("./static/Montserrat-Bold.ttf")
    });

    this.setState({
      fontLoaded: true
    });
  }

  render() {
    return this.state.fontLoaded
      ? <ApolloProvider client={client} store={store}>
          <Root />
        </ApolloProvider>
      : null;
  }
}
