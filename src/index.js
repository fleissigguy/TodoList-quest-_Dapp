import Web3 from "web3";
import TodoList from "../build/contracts/TodoList.json";

(() => {
  let web3;
  let todoList;

  const web3Init = () => {
    return new Promise((resolve, reject) => {
      // new meta/eth
      if (typeof window.ethereum !== "undefined") {
        window.ethereum
          .enable()
          .then(() => {
            return resolve(new Web3(window.ethereum));
          })
          .catch((e) => {
            reject(e);
          });
      }
      // old meta/web3
      if (typeof window.web3 !== "undefined") {
        return resolve(new Web3(window.web3.currentProvider));
      }
      // local/genache
      resolve(new Web3("http://localhost:9545"));
    });
  };
  const contractInit = () => {
    const networkKey = Object.keys(TodoList.networks)[0];
    return new web3.eth.Contract(
      TodoList.abi,
      TodoList.networks[networkKey].address
    );
  };
  const documentInit = () => {
    let accounts = [];
    web3.eth.getAccounts().then((_accounts) => {
      accounts = _accounts;
    });
    const questDisplay = (result) => {
      let noQuest = document.getElementById("noQuest");
      if (result.length === 0) {
        noQuest.textContent = "no quest available";
      } else {
        result.forEach((item) => {
          table.innerHTML = `
                <tr>
                  <td><b>#</b></td>
                  <td><b>Post Date</b></td>
                  <td><b>Details</b></td>
                  <td><b>Creator</b></td>
                  <td><b>Completed</b></td>
                  <td><b>Date completed</b></td>
                  <td></td>
                </tr>
                 `;
          let newRow = document.createElement("tr");
          let idCol = document.createElement("td");
          let postDateCol = document.createElement("td");
          let detailsCol = document.createElement("td");
          let creatorCol = document.createElement("td");
          let completedCol = document.createElement("td");
          let completedDateCol = document.createElement("td");
          let checkboxCol = document.createElement("td");
          todoList.methods
            .getQuest(item)
            .call()
            .then((e) => {
              newRow.appendChild(idCol);
              newRow.appendChild(postDateCol);
              newRow.appendChild(detailsCol);
              newRow.appendChild(creatorCol);
              newRow.appendChild(completedCol);
              newRow.appendChild(completedDateCol);
              newRow.appendChild(checkboxCol);
              checkboxCol.innerHTML = `<input id="${e.id}" type="checkbox">`;
              table.appendChild(newRow);
              idCol.textContent = e.id;
              let date1 = new Date(e.postDate * 1000);
              let postDate = `${date1.getDate()}/${
                date1.getMonth() + 1
              }/${date1.getFullYear()}`;
              let postTime = `${date1.getHours()} : ${date1.getMinutes()}`;
              postDateCol.textContent = `${postDate} - ${postTime}`;
              detailsCol.textContent = e.details;
              creatorCol.textContent = e.creator;
              completedCol.textContent = e.completed;
              if(e.completed === 'YES'){
                newRow.removeChild(checkboxCol);
                newRow.style.textDecorationLine = 'line-through';
              }
              if(e.completedDate == 0){
                completedDateCol.textContent = '';
              }
              else{
                let date2 = new Date(e.completedDate * 1000);
              let completedDate = `${date2.getDate()}/${
                date2.getMonth() + 1
              }/${date2.getFullYear()}`;
              let completedTime = `${date2.getHours()} : ${date2.getMinutes()}`;
              completedDateCol.textContent = `${completedDate} - ${completedTime}`;

              }
              noQuest.textContent = "";
              let checkbox = document.getElementById(`${e.id}`);
              checkbox.addEventListener("click", () => {
                todoList.methods
                  .complete(e.id)
                  .send({ from: accounts[0] })
                  .then(() => {
                    availableQuest();
                  });
              });
            });
        });
      }
    };
    let table = document.getElementById("table");
    let availableQuest = () => {
      todoList.methods
        .getQuestIds()
        .call()
        .then((result) => {
          questDisplay(result);
        });
    };
    availableQuest();
    let createForm = document.forms.questForm;
    createForm.addEventListener("submit", (e) => {
      let details = questForm.details.value;
      let creator = questForm.creator.value;
      let confirmation = document.getElementById("confirmation");
      let error = document.getElementById("error");
      e.preventDefault();
      if (details && creator !== "") {
        todoList.methods
          .createQuest(details, creator)
          .send({ from: accounts[0] })
          .then(() => {
            error.textContent = "";
            confirmation.textContent = `A new quest added by ${creator}`;
            availableQuest();
            console.log();
          });
      } else {
        confirmation.textContent = "";
        error.textContent = "invalid input";
      }
    });

  };
  web3Init()
    .then((_web3) => {
      web3 = _web3;
      todoList = contractInit();
      documentInit();
    })
    .catch((e) => {
      console.log(e.message);
    });
})();
