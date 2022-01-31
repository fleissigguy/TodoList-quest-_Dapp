// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
   struct Quest{
        uint id;
        uint postDate;
        uint completedDate;
        string details;
        string creator;
        string completed;

    }
    mapping(uint => Quest) quest;
    uint prevId = 0;
    uint[] questIds;
    event QuestInfo(
        uint id,
        uint postDate,
        uint completedDate,
        string details,
        string creator,
        string completed);

    function createQuest(string memory _details, string memory _creator)external {
        prevId++;
        quest[prevId] = Quest(prevId, block.timestamp,0, _details, _creator, 'NO');
        questIds.push(prevId);
        emit QuestInfo(prevId, block.timestamp,0, _details, _creator, 'NO');
    }

    modifier questExists(uint _id){
        require(quest[_id].id >= 1, "quest does not exist");
        _;
    }

    function getQuest(uint _id) public view questExists(_id) returns(Quest memory){
        return(quest[_id]);

    }
    function getQuestIds()public view returns(uint[] memory){
        return questIds;
    }
    function complete(uint _id) public questExists(_id) {
            quest[_id].completed = 'YES';
            quest[_id].completedDate = block.timestamp;
            emit QuestInfo(prevId, quest[_id].postDate, block.timestamp, quest[_id].details, quest[_id].creator, quest[_id].completed);
    }
}

