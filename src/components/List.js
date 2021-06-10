import React from 'react';
const List = (props) => {
  const { repos } = props;
  if (!repos || repos.length === 0) return <p>No data, sorry</p>;
  return (
    <ul>
      <h2 className='list-head'>Vesper.fi Historical Data</h2>
      {repos.map((repo) => {
        return (
          <li key={repo.chainId} className='list'>
            <b>Stable Coin:</b> <span className='repo-text'>{repo.name} </span> <br/>
            <b>Address:</b> <span className='repo-description'>{repo.address}</span> <br/>
            <b>Actual Price:</b> <span className='repo-description'>{repo.asset["price"]}</span> <br/>
            <b>Token Value:</b> <span className='repo-description'>{repo.tokenValue}</span> <br/>
            <b>Total Supply:</b> <span className='repo-description'>{repo.totalSupply}</span> <br/>
            <b>Total Value:</b> <span className='repo-description'>{repo.totalValue}</span> <br/>
            <b>Interest Fee:</b> <span className='repo-description'>{repo.interestFee}</span> <br/>
            <b>Actual Rates:</b> 1 day: <span className='repo-description'>{repo.actualRates["1"]} </span> |
            2 day: <span className='repo-description'>{repo.actualRates["2"]} </span> | 
            7 day: <span className='repo-description'>{repo.actualRates["7"]} </span> |
            30 day: <span className='repo-description'>{repo.actualRates["30"]} </span><br/> 
            <b>Earning Rates:</b> 1 day: <span className='repo-description'>{repo.earningRates["1"]} </span> |
            2 day: <span className='repo-description'>{repo.earningRates["2"]} </span> | 
            7 day: <span className='repo-description'>{repo.earningRates["7"]} </span> |
            30 day: <span className='repo-description'>{repo.earningRates["30"]} </span><br/> 
            <b>VSP Delta Rates:</b> 1 day: <span className='repo-description'>{repo.vspDeltaRates["1"]} </span> |
            2 day: <span className='repo-description'>{repo.vspDeltaRates["2"]} </span> | 
            7 day: <span className='repo-description'>{repo.vspDeltaRates["7"]} </span> |
            30 day: <span className='repo-description'>{repo.vspDeltaRates["30"]} </span><br/> 
            <b>Interest Fee:</b> <span className='repo-description'>{repo.interestFee}</span> <br/>
          </li>
        );
      })}
    </ul>
  );
};
export default List;