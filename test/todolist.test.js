const Todo = require(`../lib/todo`);
const TodoList = require(`../lib/todolist.js`);

describe(`TodoList`, () => {
  let todo1;
  let todo2;
  let todo3;
  let list;

  beforeEach(() => {
    todo1 = new Todo('Buy milk');
    todo2 = new Todo('Clean room');
    todo3 = new Todo('Go to the gym');

    list = new TodoList(`Today's Todos`);
    list.add(todo1);
    list.add(todo2);
    list.add(todo3);
  });

  test('todolist has a size of 3', () => {
    expect(list.size()).toBe(3);
  });

  test('toArray should return list in an array form', () => {
    expect(list.toArray()).toEqual([todo1, todo2, todo3]);
  });

  test('calling first should return the first todo', () => {
    expect(list.first()).toEqual(todo1);
  });

  test('calling last should return the last todo', () => {
    expect(list.last()).toEqual(todo3);
  });

  test('shift should remove and return the first item in the list', () => {
    expect(list.shift()).toEqual(todo1);
    expect(list.toArray()).toEqual([todo2, todo3]);
  });

  test('pop should remove and return the last item in the list', () => {
    expect(list.pop()).toEqual(todo3);
    expect(list.toArray()).toEqual([todo1, todo2]);
  });

  test('every todo is completed', () => {
    expect(list.isDone()).toBe(false);
  });

  test(`a TypeError should occur when attempting to add an item that isn't a todo`, () => {
    let todo4 = 'Schedule appointment';
    let todo5 = 5;
    let todo6 = [];
    let list2 = new TodoList();
    expect(() => list.add(todo4)).toThrow(TypeError);
    expect(() => list.add(todo5)).toThrow(TypeError);
    expect(() => list.add(todo6)).toThrow(TypeError);
    expect(() => list.add(list2)).toThrow(TypeError);
  });

  test('retrieve item at index or throw ReferenceError if the index does not have an element', () => {
    expect(list.itemAt(0)).toEqual(todo1);
    expect(() => list.itemAt(5)).toThrow(ReferenceError);
  });

  test('should mark item at given index as completed', () => {
    expect(() => list.markDoneAt(5)).toThrow(ReferenceError);
    list.markDoneAt(1);
    expect(todo1.isDone()).toBe(false);
    expect(todo2.isDone()).toBe(true);
    expect(todo3.isDone()).toBe(false);
  });

  test('should mark item at given index as incomplete', () => {
    expect(() => list.markUndoneAt(5).toThrow(ReferenceError));
    todo1.markDone();
    todo2.markDone();
    todo3.markDone();

    list.markUndoneAt(1);
    expect(todo1.isDone()).toBe(true);
    expect(todo2.isDone()).toBe(false);
    expect(todo3.isDone()).toBe(true);
  });

  test('should mark all items in list as complete', () => {
    list.markAllDone();

    expect(todo1.isDone()).toBe(true);
    expect(todo2.isDone()).toBe(true);
    expect(todo3.isDone()).toBe(true);
    expect(list.isDone()).toBe(true);
  });

  test('should mark all items in list as incomplete', () => {
    list.markAllDone();
    list.markAllUndone();

    expect(todo1.isDone()).toBe(false);
    expect(todo2.isDone()).toBe(false);
    expect(todo3.isDone()).toBe(false);
    expect(list.isDone()).toBe(false);
  });

  test('should remove item from list at given index', () => {
    expect(() => list.removeAt(3)).toThrow(ReferenceError);

    let removedItem = list.removeAt(0);
    expect(removedItem).toEqual([todo1]);
    expect(list.toArray()).toEqual([todo2, todo3]);
  });

  test('toString returns string representation of the list', () => {
    let string = `---- Today's Todos ----
[ ] Buy milk
[ ] Clean room
[ ] Go to the gym`;

    expect(list.toString()).toBe(string);
  });

  test('toString should return a string representation of the list showing than an item has been completed', () => {
    list.markDoneAt(0);

    let string = `---- Today's Todos ----
[X] Buy milk
[ ] Clean room
[ ] Go to the gym`;

    expect(list.toString()).toBe(string);
  });

  test('toString returns correct string showing all items as done', () => {
    list.markAllDone();

    let string = `---- Today's Todos ----
[X] Buy milk
[X] Clean room
[X] Go to the gym`;

    expect(list.toString()).toBe(string);
  });

  test('forEach iterates over every element in list', () => {
    list.toArray().forEach(todo => todo.markDone());

    expect(todo1.isDone()).toBe(true);
    expect(todo2.isDone()).toBe(true);
    expect(todo3.isDone()).toBe(true);
  });

  test('filter returns new, filtered list', () => {
    list.markAllDone();
    let func = todo => todo.isDone();
    let completedList = list.filter(func);

    expect(completedList).toEqual(list);
    expect(completedList.toString()).toEqual(list.toString());
  });

  test('findByTitle returns todo via title name', () => {
    expect(list.findByTitle('Buy milk')).toEqual(todo1);
    expect(list.findByTitle('Buy milk').getTitle()).toEqual(todo1.getTitle());
  });

  test('markDone should mark a todo as complete via given title', () => {
    list.markDone('Buy milk');
    expect(list.findByTitle('Buy milk').isDone()).toBe(true);

    list.markDone('Buy groceries');
    expect(list.findByTitle('Buy groceries')).toBeUndefined();
  });

  test('allDone returns an object with all the completed todos', () => {
    expect(list.allDone().toArray()).toEqual([]);

    list.markAllDone();
    expect(list.allDone().toArray()).toEqual([todo1, todo2, todo3]);
  });

  test('allNotDone returns an object with all the incomplete todos', () => {
    expect(list.allNotDone().toArray()).toEqual([todo1, todo2, todo3]);

    list.markAllDone();
    expect(list.allNotDone().toArray()).toEqual([]);
  });
});