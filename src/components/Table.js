import React, { useState, useEffect } from "react";
import "./Table.css";
import allnames from "../data/all_names.txt";
import playerData from "../data/playerData.json";

const Table = () => {
  const [totalWar, setWar] = useState(0);
  const [players, setPlayers] = useState([]);
  const [playersIds, setPlayersIds] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [searchSuggestion, setSearchSuggestion] = useState([]);
  const [enteredName, setEnteredName] = useState("");
  const [isSugVisible, setSugVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(allnames);
        const text = await response.text();
        const lines = text.split("\n");
        setDataArray(lines);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let sum=0;
    for (const player of players){
      sum+=player.war;
    }
    setWar(Number(sum.toFixed(2)));

  }, [players]);

  const handleInput = (event) => {
    setSugVisible(true);
    setEnteredName(event.target.value);
    const filteredData = dataArray.filter((item) =>
      item.toLowerCase().includes(enteredName.toLowerCase())
    );
    setSearchSuggestion(filteredData);
  };

  const addPlayer = () => {
    if (enteredName === "") {
      window.alert("Invalid name!");
    } else {
      getPlayerID();
      let newPlayer = {
        name: enteredName,
        team: 0,
        position: 0,
        evo: 0,
        evd: 0,
        war: 0,
        cap: 0,
      };
      playerData.rows.filter((player) => {
        if (player[0] == enteredName) {
          newPlayer.team = player[1];
          newPlayer.position = player[2];
          newPlayer.evo = Number(player[3].toFixed(2));
          newPlayer.evd = Number(player[4].toFixed(2));
          newPlayer.war = Number(player[5].toFixed(2));
          newPlayer.cap = player[6];
        }
      });
      setPlayers([...players, newPlayer]);
      setEnteredName("");
    }
  };

  const removePlayer = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
    const updatedPlayersIds = [...playersIds];
    updatedPlayersIds.splice(index, 1);
    setPlayersIds(updatedPlayersIds);
  };

  const getPlayerID = () => {
    fetch("https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster")
      .then((response) => response.json())
      .then((data) => {
        let teams = data.teams;
        for (let entry of teams) {
          let roster = entry.roster.roster;
          for (let player of roster) {
            if (player.person.fullName === enteredName) {
              setPlayersIds([...playersIds, player.person.id]);
              break;
            }
          }
        }
      });
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="topWrap">
          <h2>Total WAR: {totalWar}</h2>
        </div>
        <div className="tradePieceContainer">
          {players.map((player, index) => (
            <div className="tradePiece" key={index} onClick={() => removePlayer(index)}>
              <img src={`http://nhl.bamcontent.com/images/headshots/current/168x168/${playersIds[index]}.png`} />
              <h3>{player.name}</h3>
              <h3>EVO: {player.evo}</h3>
              <h3>EVD: {player.evd}</h3>
              <h3>WAR: {player.war}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="bottomContainer">
        <div className="searchContainer">
          <input
            className="playerSearch"
            value={enteredName}
            onChange={handleInput}
            placeholder="Player"
          ></input>
          {isSugVisible & (enteredName !== "") ? (
            <div
              className="suggestionBox"
              onClick={() => {
                setEnteredName(searchSuggestion[0]);
                setSugVisible(false);
              }}
            >
              {searchSuggestion[0]}
            </div>
          ) : null}
        </div>
      </div>
      <button className="addButton" onClick={addPlayer}>
          Add
      </button>
    </div>
  );
};

export default Table;
