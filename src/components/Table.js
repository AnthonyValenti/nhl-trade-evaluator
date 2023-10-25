import React, { useState, useEffect } from "react";
import "./Table.css";
import allnames from "../data/all_names.txt";

const Table = () => {
  const [totalWar, setWar] = useState(0);
  const [players, setPlayers] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [searchSuggestion, setSearchSuggestion] = useState([]);
  const [enteredName, setEnteredName] = useState("");
  const [isSugVisible, setSugVisible] = useState(false)

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

  const handleInput = (event) => {
    setSugVisible(true)
    setEnteredName(event.target.value);
    const filteredData = dataArray.filter((item) =>
      item.toLowerCase().includes(enteredName.toLowerCase())
    );
    setSearchSuggestion(filteredData);
  };

  const addPlayer = () => {
    let newPlayer = {
      name: enteredName,
      evo: 3.1,
      evd: 2.1,
      war: "5.0",
    };
    setPlayers([...players, newPlayer]);
    setEnteredName("");
  };

  const removePlayer = (index) => {
    console.log(index);
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
  };

  const getPlayerID = async () => {
    let playerID;
    let teamID;
    await fetch("https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster")
      .then((response) => response.json())
      .then((data) => {
        let teams = data.teams;

        for (let entry of teams) {
          let roster = entry.roster.roster;

          for (let player of roster) {
            if (player.person.fullName === "Auston Matthews") {
              playerID = player.person.id;
              teamID = entry.id;
            }
          }
        }
      });
    console.log(playerID, teamID);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="topWrap">
          <h2>Total WAR: {totalWar}</h2>
        </div>
        <div className="tradePieceContainer">
          {players.map((player, index) => (
            <div className="tradePiece" onClick={() => removePlayer(index)}>
              <img src="http://nhl.bamcontent.com/images/headshots/current/168x168/8479318.png" />
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
            placeholder="Enter name"
          ></input>
          {isSugVisible & enteredName!=""? (
            <div className="suggestionBox" onClick={()=>{setEnteredName(searchSuggestion[0]); setSugVisible(false)}}>{searchSuggestion[0]}</div>
          ): null}
        </div>
        <button className="addButton" onClick={addPlayer}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Table;
