import React, { useEffect,useState  } from 'react'
import './App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import List from './List';
import withListLoading from './withListLoading';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})


const DAI_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      derivedETH
      totalLiquidity
      
    }
  }
`

const USDC_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      derivedETH
      totalLiquidity
    }
  }
`

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`

function App() {
  

  const ListLoading = withListLoading(List);
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  });

  const [curveState, setCurveState] = useState({
    susdApy: null,
    poolApy: null, 
    susdVolume: null,
    poolVolume: null,  
    
  });


  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.vesper.finance/pools?stages=prod`;
    
    
    fetch(apiUrl)
      .then((res) => res.json())
      .then((repos) => {
        setAppState({ loading: false, repos: repos });
      });
     
  }, [setAppState]);
  
  useEffect(() => {
    const curveURL = `https://stats.curve.fi/raw-stats/apys.json`;

    fetch(curveURL)
    .then((response) => response.json())
    .then((curveData) => {
      setCurveState({ 
        susdApy: curveData.apy.day.susd, 
        poolApy: curveData.apy.day["3pool"],

        susdVolume: curveData.volume.susd, 
        poolVolume: curveData.volume["3pool"]
      });
      console.log(curveData)
    });

  }, [setCurveState]);


  


  const { loading: ethLoading, data: ethPriceData } = useQuery(ETH_PRICE_QUERY)
  const { loading: daiLoading, data: daiData } = useQuery(DAI_QUERY, {
    variables: {
      tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f'
    }
  })

  const { loading: usdcLoading, data: usdcData } = useQuery(USDC_QUERY, {
    variables: {
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    }
  })
  

  const daiPriceInEth = daiData && daiData.tokens[0].derivedETH
  const daiTotalLiquidity = daiData && daiData.tokens[0].totalLiquidity
  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice


  //USDC data details:
  const usdcPriceInEth = usdcData && usdcData.tokens[0].derivedETH
  const usdcTotalLiquidity = usdcData && usdcData.tokens[0].totalLiquidity

  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <div>
                <h2>
                  Dai price:{' '}
                  {ethLoading || daiLoading
                    ? 'Loading token data...'
                    : '$' + 
                      (parseFloat(daiPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
                </h2>
                <h2>
                  Dai total liquidity:{' '}
                  {daiLoading
                    ? 'Loading token data...'
                    : parseFloat(daiTotalLiquidity).toFixed(0)}
                </h2>
              </div>
            </div>
           
          </main>
          <main role="main" className="col-lg-12 d-flex text-center">
            {/* USDC */}
            <div className="content mr-auto ml-auto">
              <div>
                <h2>
                  USDC price:{' '}
                  {ethLoading || usdcLoading
                    ? 'Loading token data...'
                    : '$' +
                      // parse responses as floats and fix to 2 decimals
                      (parseFloat(usdcPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
                </h2>
                <h2>
                  USDC total liquidity:{' '}
                  {usdcLoading
                    ? 'Loading token data...'
                    : // display the total amount of USDC spread across all pools
                      parseFloat(usdcTotalLiquidity).toFixed(0)}
                </h2>
              </div>
            </div>
            </main>
        </div>
      </div>
      <div className='App'>
        <div className='container'>
        </div>
        <div className='repo-container'>
          <ListLoading isLoading={appState.loading} repos={appState.repos} />
        </div>
      </div>

      <div className='App'>
        <div className='container'>
        </div>
        <div className='repo-container'>
            <h2>Curve.Fi</h2>
            <ul>
              <li><b>Base Apy (sUSD):</b> {Number((curveState.susdApy*100).toFixed(2))} | 
              <b>Volume (sUSD):</b> {curveState.susdVolume}</li>
              <li><b>Base Apy (3pool):</b> {Number((curveState.poolApy*100).toFixed(2))}|
              <b>Volume (3pool):</b> {curveState.poolVolume}</li>
            </ul>
        </div>
      </div>
    </div>
  );
}

export default App
