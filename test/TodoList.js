const TodoList = artifacts.require('TodoList');

contract('Todolist', () => {
    it('should work', async () => {
        const todoList = await TodoList.deployed();
        let result = await todoList.greet();
        assert(result == 'Hello');
    })
})