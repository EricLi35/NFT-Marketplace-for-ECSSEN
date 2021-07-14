import React from 'react';
import PropTypes from 'prop-types';
import Order from '../Order';
import { OrderSide } from 'opensea-js/lib/types';
import { connectWallet } from '../../../constants';
import "./index.css";



export default class Log extends React.Component {
  static propTypes = {
    seaport: PropTypes.object.isRequired,
    accountAddress: PropTypes.string,
  };

  state = {
    orders: undefined,
    total: 0,
    side: undefined,
    onlyForMe: false,
    onlyByMe: false,
    onlyBundles: false,
    page: 1
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {

    //temp solution! how to filter specifically for giveNFT collection, AND for nft's that are on sale?
    //throws error for i > 300, looks like we are being throttled? unsure if it is realistic to iterate through all NFT's like I have done here.
    /* var token_ids = [];
    for (var i = 0; i < 200; i++)  {
      token_ids[i] = i;
    }
    console.log(token_ids); */


    //future permanent solution; however, this request is currently being rate-limited. I believe using an API key can fix this (perhaps can be used when we move to mainnet).
    //fetch sell orders => take token_ids from orders => pass to getOrders() function along with asset_contract_address

    const fetch = require('node-fetch'); 

    const url = 'https://rinkeby-api.opensea.io/wyvern/v1/orders?collection_slug=givenft&bundled=false&include_bundled=false&include_invalid=false&limit=20&offset=0&order_by=created_date&order_direction=desc';
    const options = {method: 'GET', headers: {Accept: 'application/json'}};
    var token_ids = [];

    try {

      await fetch(url, options)
        .then(res => res.json())
        .then(json => {
          console.log(json);
          for (var i = 0; i < json.orders.length; i++){
          token_ids.push(json.orders[i].asset.token_id);
        }})
        .catch(err => console.error('error:' + err));

        console.log(token_ids);

      } catch(error) {}

    const { accountAddress } = this.props
    const { orders, count } = await this.props.seaport.api.getOrders({
      maker: this.state.onlyByMe ? accountAddress : undefined,
      owner: this.state.onlyForMe ? accountAddress : undefined,
      side: this.state.side,
      bundled: this.state.onlyBundles ? true : undefined,
      // Possible query options:
      asset_contract_address: "0x5F0ea95E05af06499B4F91a772f781816122Dd54",
      // 'taker'
      // 'token_id'
      token_ids
      // 'sale_kind'
      
    }, this.state.page)

    console.log(orders);

    this.setState({ orders, total: count })
  }

  paginateTo(page) {
    this.setState({ orders: undefined, page }, () => this.fetchData())
  }

  toggleSide(side) {
    if (this.state.side === side) {
      side = undefined
    }
    this.setState({
      orders: undefined,
      side,
      onlyForMe: undefined
    }, () => this.fetchData())
  }

  async toggleForMe() {
    const { accountAddress } = this.props
    if (!accountAddress) {
      await connectWallet()
    }
    const { onlyForMe } = this.state
    this.setState( {
      orders: undefined,
      onlyForMe: !onlyForMe,
      onlyByMe: false,
      // Doesn't make sense to show sell orders the user makes
      side: onlyForMe ? undefined : OrderSide.Buy,
    }, () => this.fetchData())
  }

  toggleBundles() {
    const { onlyBundles } = this.state
    this.setState( {
      orders: undefined,
      onlyBundles: !onlyBundles,
      onlyByMe: false,
      // Only sell-side for now
      side: OrderSide.Sell,
    }, () => this.fetchData())
  }

  async toggleByMe() {
    const { accountAddress } = this.props
    if (!accountAddress) {
      await connectWallet()
    }
    const { onlyByMe } = this.state
    this.setState( {
      orders: undefined,
      onlyByMe: !onlyByMe,
      onlyForMe: false
    }, () => this.fetchData())
  }

  renderPagination() {
    const { page, total } = this.state
    const ordersPerPage = this.props.seaport.api.pageSize
    const noMorePages = page*ordersPerPage >= total
    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={"page-item " + (page === 1 ? "disabled" : "")}>
            <a className="page-link" href="#Log"
              onClick={() => this.paginateTo(page - 1)} tabIndex="-1">
              Previous
            </a>
          </li>
          <li className={"page-item " + (noMorePages ? "disabled" : "")}>
            <a className="page-link" href="#Log"
              onClick={() => this.paginateTo(page + 1)}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    )
  }

  renderFilters() {
    const { onlyByMe, onlyForMe, onlyBundles } = this.state
    const sellSide = this.state.side === OrderSide.Sell
    const buySide = this.state.side === OrderSide.Buy

    return (
      <div className="row">
        <div className="mb-3_ml-4">
          Filter orderbook:
          <div className="btn-group_ml-4" role="group">
            <button type="button" className={"btn btn-outline-primary " + (sellSide ? "active" : "")} data-toggle="button" onClick={() => this.toggleSide(OrderSide.Sell)}>
              Auctions
            </button>
            <button type="button" className={"btn btn-outline-success " + (buySide ? "active" : "")} data-toggle="button" onClick={() => this.toggleSide(OrderSide.Buy)}>
              Bids
            </button>
          </div>
        {/* </div>
        <div className="mb-3 ml-4">
          <div className="btn-group" role="group">
            <button type="button" className={"btn btn-outline-secondary " + (onlyForMe ? "active" : "")} data-toggle="button" onClick={() => this.toggleForMe()}>
              For Me
            </button>
            <button type="button" className={"btn btn-outline-secondary " + (onlyByMe ? "active" : "")} data-toggle="button" onClick={() => this.toggleByMe()}>
              By Me
            </button>
          </div>
        </div>
        <div className="mb-3 ml-4">
          <button type="button" className={"btn btn-outline-info " + (onlyBundles ? "active" : "")} data-toggle="button" onClick={() => this.toggleBundles()}>
            Bundles
          </button> */}
        </div>
      </div>
    )
  }

  render() {
    const { orders } = this.state

    return (
      <div className="py-3" id="Log">
        
        {this.renderFilters()}

        {orders != null
        
          ? <React.Fragment>
              <div className="card-deck">
                {orders.map((order, i) => {
                  return <Order {...this.props} key={i} order={order}  />
                })}
              </div>
              {this.renderPagination()}
            </React.Fragment>

          : <div className="text-center">Loading...</div>
        }
      </div>
    );
  }
}
