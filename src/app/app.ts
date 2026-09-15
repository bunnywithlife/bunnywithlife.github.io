import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface PracticeQuestion {
  id: number;
  description: string;
  query: string;
  hint: string;
}

interface Lesson {
  id: number;
  name: string;
  title: string;
  description: string;
  content: {
    points: string[];
    syntax: string;
    example: string;
    explanation: string[];
  };
  query: string;
  hint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  quiz: QuizQuestion;
  practiceQuestions: PracticeQuestion[];
}

interface TableSchema {
  name: string;
  columns: string[];
  sampleData: Record<string, string | number>[];
  description: string;
}

type TabType = 'home' | 'lessons' | 'roadmap';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class App {
  userLevel: number = 1;
  userXP: number = 0;
  currentStreak: number = 0;

  private readonly apiBaseUrl = 'http://localhost:3000/api';
  executionSummary: string = '';

  activeTab: TabType = 'home';
  sqlInput: string = '';
  feedbackMessage: string = '';
  queryFeedbackMessage: string = '';
  quizFeedbackMessage: string = '';
  taskCompleted: boolean = false;
  showNotes: boolean = false;
  showSchema: boolean = false;

  openLessonFromRoadmap(index: number): void {
    this.currentLessonIndex = index;
    this.activeTab = 'lessons';
    this.selectedPracticeQuestionIndex = 0;
    this.selectedQuizAnswer = null;
    this.quizAnswered = false;
    this.feedbackMessage = '';
  }
  currentLessonIndex: number = 0;
  selectedQuizAnswer: number | null = null;
  quizAnswered: boolean = false;
  selectedPracticeQuestionIndex: number = 0;
  selectedTableIndex: number = 0;

  tables: TableSchema[] = [
    {
      name: 'users',
      columns: ['id', 'name', 'email', 'age'],
      description: 'Contains user account information',
      sampleData: [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34 },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45 },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 29 },
        { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', age: 52 },
      ],
    },
    {
      name: 'products',
      columns: ['id', 'name', 'price', 'stock'],
      description: 'Contains product catalog information',
      sampleData: [
        { id: 1, name: 'Laptop', price: 999, stock: 15 },
        { id: 2, name: 'Mouse', price: 25, stock: 50 },
        { id: 3, name: 'Keyboard', price: 79, stock: 30 },
        { id: 4, name: 'Monitor', price: 299, stock: 20 },
        { id: 5, name: 'USB Cable', price: 10, stock: 100 },
      ],
    },
    {
      name: 'employees',
      columns: ['id', 'name', 'department', 'salary'],
      description: 'Contains employee information',
      sampleData: [
        { id: 1, name: 'John Smith', department: 'IT', salary: 75000 },
        { id: 2, name: 'Sarah Johnson', department: 'HR', salary: 65000 },
        { id: 3, name: 'Mike Davis', department: 'IT', salary: 80000 },
        { id: 4, name: 'Emily Brown', department: 'Finance', salary: 72000 },
        { id: 5, name: 'David Lee', department: 'IT', salary: 77000 },
      ],
    },
    {
      name: 'orders',
      columns: ['id', 'customer_id', 'order_date', 'status'],
      description: 'Contains customer order records',
      sampleData: [
        { id: 101, customer_id: 1, order_date: '2024-01-15', status: 'Completed' },
        { id: 102, customer_id: 2, order_date: '2024-02-20', status: 'Pending' },
        { id: 103, customer_id: 1, order_date: '2024-03-10', status: 'Completed' },
        { id: 104, customer_id: 3, order_date: '2024-03-25', status: 'Shipped' },
        { id: 105, customer_id: 2, order_date: '2024-04-05', status: 'Completed' },
      ],
    },
    {
      name: 'customers',
      columns: ['id', 'name', 'email', 'is_active'],
      description: 'Contains customer profile information',
      sampleData: [
        { id: 1, name: 'Alice Wilson', email: 'alice.w@example.com', is_active: 1 },
        { id: 2, name: 'Bob Martinez', email: 'bob.m@example.com', is_active: 1 },
        { id: 3, name: 'Carol White', email: 'carol.w@example.com', is_active: 0 },
        { id: 4, name: 'David Green', email: 'david.g@example.com', is_active: 1 },
        { id: 5, name: 'Eve Thompson', email: 'eve.t@example.com', is_active: 1 },
      ],
    },
  ];

  lessons: Lesson[] = [
    {
      id: 1,
      name: 'Lesson 1',
      title: 'SELECT Statement Basics',
      description: 'Learn the fundamentals of the SELECT statement',
      content: {
        points: [
          'SELECT is used to retrieve data from a database table.',
          'It allows us to choose which columns we want to display.',
          'We can select one column, multiple columns, or all columns.',
          'The * symbol is used when we want to retrieve all columns from a table.',
        ],

        syntax: 'SELECT column1, column2 FROM table_name;',

        example: 'SELECT * FROM users;',

        explanation: [
          'SELECT tells SQL that we want to retrieve data.',
          '* means all columns of the table.',
          'FROM tells SQL which table we want to retrieve the data from.',
          'users is the name of the table from which the data is retrieved.',
        ],
      },

      query: 'SELECT * FROM users;',
      hint: 'Use SELECT * to get all columns from the users table.',
      difficulty: 'Easy',
      practiceQuestions: [
        {
          id: 1,
          description: 'Get all columns and rows from the users table',
          query: 'SELECT * FROM users;',
          hint: 'Use SELECT * and FROM keywords.',
        },
        {
          id: 2,
          description: 'Retrieve all data from the products table',
          query: 'SELECT * FROM products;',
          hint: 'Similar to users table, just change the table name.',
        },
        {
          id: 3,
          description: 'Get all records from the employees table',
          query: 'SELECT * FROM employees;',
          hint: 'Use SELECT * to get everything.',
        },
        {
          id: 4,
          description: 'Select all data from the orders table',
          query: 'SELECT * FROM orders;',
          hint: 'Apply the same SELECT * pattern.',
        },
        {
          id: 5,
          description: 'Retrieve all columns from the customers table',
          query: 'SELECT * FROM customers;',
          hint: 'Remember the basic SELECT * syntax.',
        },
      ],
      quiz: {
        question: 'What does SELECT * FROM users; do?',
        options: [
          'Returns all columns from the users table',
          'Returns only the first row',
          'Deletes all data from users table',
          'Updates the users table',
        ],
        correctAnswer: 0,
        explanation: 'SELECT * retrieves all columns and rows from the specified table.',
      },
    },
    {
      id: 2,
      name: 'Lesson 2',
      title: 'WHERE Clause - Filtering Data',
      description: 'Filter results using WHERE conditions',
      content: {
        points: [
          'The WHERE clause is used to filter records from a table.',
          'It allows us to retrieve only the rows that satisfy a specific condition.',
          'WHERE is commonly used with comparison operators such as =, >, <, >=, <= and <>.',
          'It helps us find specific records instead of displaying all records.',
        ],

        syntax: 'SELECT column1, column2 FROM table_name WHERE condition;',

        example: 'SELECT * FROM users WHERE age > 25;',

        explanation: [
          'SELECT * means we want to retrieve all columns.',
          'FROM users tells SQL to retrieve the data from the users table.',
          'WHERE age > 25 filters the records and displays only users whose age is greater than 25.',
          'The condition after WHERE determines which records will be displayed.',
        ],
      },
      query: 'SELECT * FROM users WHERE age > 25;',
      hint: 'Use WHERE followed by your condition to filter results.',
      difficulty: 'Easy',
      practiceQuestions: [
        {
          id: 1,
          description: 'Get all users with age greater than 25',
          query: 'SELECT * FROM users WHERE age > 25;',
          hint: 'Use WHERE with > operator.',
        },
        {
          id: 2,
          description: 'Find all products with price less than 100',
          query: 'SELECT * FROM products WHERE price < 100;',
          hint: 'Use WHERE with < operator.',
        },
        {
          id: 3,
          description: 'Get all employees from the IT department',
          query: 'SELECT * FROM employees WHERE department = "IT";',
          hint: 'Use WHERE with = operator for text matching.',
        },
        {
          id: 4,
          description: 'Find all orders with status NOT equal to "Pending"',
          query: 'SELECT * FROM orders WHERE status != "Pending";',
          hint: 'Use != for NOT equal condition.',
        },
        {
          id: 5,
          description: 'Get all customers with credit score greater than 700',
          query: 'SELECT * FROM customers WHERE credit_score > 700;',
          hint: 'Similar pattern, just different table and column.',
        },
      ],
      quiz: {
        question: 'What does the WHERE clause do?',
        options: [
          'Creates new tables',
          'Filters records based on conditions',
          'Sorts data alphabetically',
          'Deletes records',
        ],
        correctAnswer: 1,
        explanation: 'WHERE clause filters records that match specified conditions.',
      },
    },
    {
      id: 3,
      name: 'Lesson 3',
      title: 'Selecting Specific Columns',
      description: 'Retrieve only the columns you need',
      content: {
        points: [
          'SQL allows us to select only the columns that we need from a table.',
          'Instead of using * to display every column, we can write specific column names after SELECT.',
          'Selecting specific columns makes the result easier to read and focuses only on the required information.',
          'We can select one column or multiple columns from the same table.',
          'The column names should be separated using commas.',
        ],

        syntax: 'SELECT column1, column2 FROM table_name;',

        example: 'SELECT name, email FROM users;',

        explanation: [
          'SELECT tells SQL that we want to retrieve data.',
          'name and email are the specific columns we want to display.',
          'The comma separates the two column names.',
          'FROM users tells SQL to retrieve the information from the users table.',
          'The result will contain only the name and email columns instead of all columns.',
        ],
      },
      query: 'SELECT name, email FROM users;',
      hint: 'List column names separated by commas.',
      difficulty: 'Easy',
      practiceQuestions: [
        {
          id: 1,
          description: 'Get name and email from users table',
          query: 'SELECT name, email FROM users;',
          hint: 'Specify column names separated by commas.',
        },
        {
          id: 2,
          description: 'Retrieve product name and price',
          query: 'SELECT name, price FROM products;',
          hint: 'Same pattern with different table and columns.',
        },
        {
          id: 3,
          description: 'Get employee name and department',
          query: 'SELECT name, department FROM employees;',
          hint: 'Two columns from employees table.',
        },
        {
          id: 4,
          description: 'Select customer name and email',
          query: 'SELECT name, email FROM customers;',
          hint: 'Apply the same multi-column selection.',
        },
        {
          id: 5,
          description: 'Retrieve order id and total amount',
          query: 'SELECT order_id, total_amount FROM orders;',
          hint: 'Works the same for any combination of columns.',
        },
      ],
      quiz: {
        question: 'To get only name and email columns, what would you use?',
        options: [
          'SELECT * FROM users',
          'SELECT name, email FROM users',
          'SELECT users(name, email)',
          'SELECT all name, email',
        ],
        correctAnswer: 1,
        explanation: 'You specify column names separated by commas after SELECT.',
      },
    },
    {
      id: 4,
      name: 'Lesson 4',
      title: 'ORDER BY - Sorting Results',
      description: 'Sort your query results in ascending or descending order',
      content: {
        points: [
          'The ORDER BY clause is used to sort the records returned by a SQL query.',
          'It can sort data in ascending order or descending order.',
          'ASC is used for ascending order, such as A to Z or smaller numbers to larger numbers.',
          'DESC is used for descending order, such as Z to A or larger numbers to smaller numbers.',
          'If no sorting direction is specified, SQL generally uses ascending order by default.',
          'ORDER BY can be used with numbers, text, dates, and other sortable values.',
        ],

        syntax: 'SELECT column1, column2 FROM table_name ORDER BY column_name ASC;',

        example: 'SELECT * FROM users ORDER BY age ASC;',

        explanation: [
          'SELECT * means that we want to retrieve all columns.',
          'FROM users tells SQL to retrieve the records from the users table.',
          'ORDER BY age tells SQL to sort the records according to the age column.',
          'ASC means the ages will be arranged from smallest to largest.',
          'For descending order, we can use DESC instead of ASC.',
        ],
      },
      query: 'SELECT * FROM users ORDER BY age ASC;',
      hint: 'Use ORDER BY column_name ASC or DESC.',
      difficulty: 'Medium',
      practiceQuestions: [
        {
          id: 1,
          description: 'Sort users by age in ascending order',
          query: 'SELECT * FROM users ORDER BY age ASC;',
          hint: 'Use ORDER BY with ASC keyword.',
        },
        {
          id: 2,
          description: 'Sort products by price in descending order',
          query: 'SELECT * FROM products ORDER BY price DESC;',
          hint: 'Use DESC for highest to lowest.',
        },
        {
          id: 3,
          description: 'Sort employees by name alphabetically',
          query: 'SELECT * FROM employees ORDER BY name ASC;',
          hint: 'ASC is default for alphabetical order.',
        },
        {
          id: 4,
          description: 'Sort orders by date in descending order (most recent first)',
          query: 'SELECT * FROM orders ORDER BY order_date DESC;',
          hint: 'DESC shows most recent dates first.',
        },
        {
          id: 5,
          description: 'Sort customers by registration date in ascending order',
          query: 'SELECT * FROM customers ORDER BY registration_date ASC;',
          hint: 'Apply ORDER BY pattern with different columns.',
        },
      ],
      quiz: {
        question: 'What does DESC mean in ORDER BY?',
        options: [
          'Description',
          'Descending order (Z to A, highest to lowest)',
          'Delimiter',
          'Decrease',
        ],
        correctAnswer: 1,
        explanation: 'DESC sorts in descending order from Z to A or highest to lowest.',
      },
    },
    {
      id: 5,
      name: 'Lesson 5',
      title: 'Aggregate Functions - COUNT',
      description: 'Count records using the COUNT function',
      content: {
        points: [
          'COUNT is an aggregate function used to count the number of records in a table.',
          'It helps us find how many rows are present in a table or how many values are available in a particular column.',
          'COUNT(*) counts all rows in the table.',
          'COUNT(column_name) counts the non-NULL values in the specified column.',
          'COUNT is useful when we want to know the total number of records without displaying all the data.',
          'Aggregate functions perform calculations on a group of rows and return a single result.',
        ],

        syntax: 'SELECT COUNT(*) FROM table_name;',

        example: 'SELECT COUNT(*) FROM users;',

        explanation: [
          'SELECT tells SQL that we want to retrieve a result.',
          'COUNT(*) counts all the rows in the table.',
          'FROM users tells SQL to count the records from the users table.',
          'The result is a single number representing the total number of records in the users table.',
          'For example, if the users table contains 5 records, COUNT(*) will return 5.',
        ],
      },
      query: 'SELECT COUNT(*) FROM users;',
      hint: 'Use COUNT(*) to count the total number of records.',
      difficulty: 'Medium',
      practiceQuestions: [
        {
          id: 1,
          description: 'Count total number of users',
          query: 'SELECT COUNT(*) FROM users;',
          hint: 'Use COUNT(*) function.',
        },
        {
          id: 2,
          description: 'Count how many products are in stock',
          query: 'SELECT COUNT(*) FROM products;',
          hint: 'Count all records in the products table.',
        },
        {
          id: 3,
          description: 'Count total employees in the company',
          query: 'SELECT COUNT(*) FROM employees;',
          hint: 'Use COUNT(*) with employees table.',
        },
        {
          id: 4,
          description: 'Count number of completed orders',
          query: 'SELECT COUNT(*) FROM orders WHERE status = "Completed";',
          hint: 'Combine COUNT with WHERE clause.',
        },
        {
          id: 5,
          description: 'Count customers with active accounts',
          query: 'SELECT COUNT(*) FROM customers WHERE is_active = 1;',
          hint: 'COUNT(*) works with WHERE conditions too.',
        },
      ],
      quiz: {
        question: 'What does COUNT(*) do?',
        options: [
          'Counts all columns',
          'Counts only non-null values',
          'Counts the total number of rows',
          'Counts unique values',
        ],
        correctAnswer: 2,
        explanation: 'COUNT(*) returns the total number of rows in the table.',
      },
    },
    {
      id: 6,
      name: 'Lesson 6',
      title: 'INSERT Statement - Adding Data',
      description: 'Learn how to add new records into a table using the INSERT statement.',
      content: {
        points: [
          'The INSERT statement is used to add new records (rows) to an existing table.',
          'It is used when we want to store new information in a database.',
          'INSERT INTO is used to specify the table in which the new record will be added.',
          'We can specify the columns in which we want to insert the data.',
          'The VALUES keyword is used to provide the actual values that will be inserted.',
          'The number and order of the values should match the selected columns.',
          'Text values are generally written inside single quotes, while numeric values are written without quotes.',
        ],

        syntax:
          'INSERT INTO table_name (column1, column2, column3)\nVALUES (value1, value2, value3);',

        example: "INSERT INTO users (name, email, age)\nVALUES ('Rahul', 'rahul@gmail.com', 22);",

        explanation: [
          'INSERT INTO users tells SQL that we want to add a new record to the users table.',
          'name, email and age are the columns where we want to insert the data.',
          'VALUES provides the actual data for those columns.',
          "'Rahul' is inserted into the name column.",
          "'rahul@gmail.com' is inserted into the email column.",
          '22 is inserted into the age column.',
          'After a successful INSERT statement, a new row is added to the table.',
        ],
      },

      query: "INSERT INTO users (name, email, age) VALUES ('Rahul', 'rahul@gmail.com', 22);",
      hint: 'Use INSERT INTO followed by the table name, column names, and VALUES.',
      difficulty: 'Easy',

      quiz: {
        question: 'Which SQL statement is used to add a new record to a table?',
        options: ['INSERT INTO', 'ADD RECORD', 'UPDATE', 'CREATE'],
        correctAnswer: 0,
        explanation: 'INSERT INTO is used to add new records to a table.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Insert a new user named Rahul with email rahul@gmail.com and age 22.',
          query: "INSERT INTO users (name, email, age) VALUES ('Rahul', 'rahul@gmail.com', 22);",
          hint: 'Use INSERT INTO users followed by the column names and VALUES.',
        },
        {
          id: 2,
          description: 'Insert a new user named Priya with email priya@gmail.com and age 21.',
          query: "INSERT INTO users (name, email, age) VALUES ('Priya', 'priya@gmail.com', 21);",
          hint: 'Specify name, email and age inside the INSERT statement.',
        },
        {
          id: 3,
          description: 'Insert a new user named Amit with email amit@gmail.com and age 25.',
          query: "INSERT INTO users (name, email, age) VALUES ('Amit', 'amit@gmail.com', 25);",
          hint: 'Use INSERT INTO users (name, email, age) and provide the values.',
        },
        {
          id: 4,
          description: 'Insert a new user named Neha with email neha@gmail.com and age 23.',
          query: "INSERT INTO users (name, email, age) VALUES ('Neha', 'neha@gmail.com', 23);",
          hint: 'Remember the order: name, email, age.',
        },
        {
          id: 5,
          description: 'Insert a new user named Karan with email karan@gmail.com and age 24.',
          query: "INSERT INTO users (name, email, age) VALUES ('Karan', 'karan@gmail.com', 24);",
          hint: 'Use INSERT INTO and VALUES to add the new record.',
        },
      ],
    },
    {
      id: 7,
      name: 'Lesson 7',
      title: 'UPDATE Statement - Modifying Data',
      description: 'Learn how to modify existing records in a table using the UPDATE statement.',

      content: {
        points: [
          'The UPDATE statement is used to modify existing records in a table.',
          'It allows us to change the value of one or more columns.',
          'The SET keyword is used to specify the new value for a column.',
          'The WHERE clause is used to identify which record or records should be updated.',
          'Without a WHERE clause, the UPDATE statement can modify all rows in the table.',
          'UPDATE is different from INSERT because UPDATE changes existing records, while INSERT adds a new record.',
        ],

        syntax: 'UPDATE table_name\nSET column_name = new_value\nWHERE condition;',

        example: "UPDATE users\nSET age = 25\nWHERE name = 'Rahul';",

        explanation: [
          'UPDATE users tells SQL that we want to modify data in the users table.',
          'SET age = 25 changes the age value to 25.',
          "WHERE name = 'Rahul' identifies the user whose record should be updated.",
          'Only the record that satisfies the WHERE condition will be modified.',
          'The WHERE clause is very important because without it, all records may be updated.',
        ],
      },

      query: "UPDATE users SET age = 25 WHERE name = 'Rahul';",

      hint: 'Use UPDATE followed by the table name, SET to change the column value, and WHERE to select the record.',

      difficulty: 'Medium',

      quiz: {
        question: 'Which SQL keyword is used to specify the new value in an UPDATE statement?',
        options: ['VALUES', 'SET', 'CHANGE', 'INSERT'],
        correctAnswer: 1,
        explanation: 'SET is used to specify the new value of a column in an UPDATE statement.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: "Update Rahul's age to 25.",
          query: "UPDATE users SET age = 25 WHERE name = 'Rahul';",
          hint: 'Use UPDATE, SET and WHERE.',
        },
        {
          id: 2,
          description: "Update Priya's age to 22.",
          query: "UPDATE users SET age = 22 WHERE name = 'Priya';",
          hint: 'Use the name in the WHERE condition.',
        },
        {
          id: 3,
          description: "Update Amit's email to amit_new@gmail.com.",
          query: "UPDATE users SET email = 'amit_new@gmail.com' WHERE name = 'Amit';",
          hint: 'Use SET to change the email and WHERE to identify Amit.',
        },
        {
          id: 4,
          description: "Update Neha's age to 24.",
          query: "UPDATE users SET age = 24 WHERE name = 'Neha';",
          hint: 'Change the age using SET and identify Neha using WHERE.',
        },
        {
          id: 5,
          description: "Update Karan's email to karan_new@gmail.com.",
          query: "UPDATE users SET email = 'karan_new@gmail.com' WHERE name = 'Karan';",
          hint: 'Use UPDATE users SET email and add a WHERE condition for Karan.',
        },
      ],
    },
    {
      id: 8,
      name: 'Lesson 8',
      title: 'DELETE Statement - Removing Data',
      description: 'Learn how to remove existing records from a table using the DELETE statement.',

      content: {
        points: [
          'The DELETE statement is used to remove existing records (rows) from a table.',
          'It can remove one record or multiple records depending on the condition.',
          'The WHERE clause is used to specify which records should be deleted.',
          'If a WHERE clause is not used, DELETE can remove all records from the table.',
          'DELETE removes rows from a table but does not remove the table itself.',
          'DELETE is different from DROP because DELETE removes records, while DROP removes the entire table.',
        ],

        syntax: 'DELETE FROM table_name\nWHERE condition;',

        example: "DELETE FROM users\nWHERE name = 'Rahul';",

        explanation: [
          'DELETE FROM users tells SQL that we want to remove data from the users table.',
          "WHERE name = 'Rahul' identifies the record that should be deleted.",
          'Only the record satisfying the condition will be removed.',
          'The users table itself will still exist after the DELETE operation.',
          'The WHERE clause is important because without it, all records may be deleted.',
        ],
      },

      query: "DELETE FROM users WHERE name = 'Rahul';",

      hint: 'Use DELETE FROM followed by the table name and use WHERE to identify the record you want to remove.',

      difficulty: 'Medium',

      quiz: {
        question: 'Which clause is used to specify which records should be deleted?',
        options: ['SET', 'VALUES', 'WHERE', 'ORDER BY'],
        correctAnswer: 2,
        explanation: 'The WHERE clause identifies the records that should be deleted.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Delete the user named Rahul.',
          query: "DELETE FROM users WHERE name = 'Rahul';",
          hint: 'Use DELETE FROM users and identify Rahul using WHERE.',
        },
        {
          id: 2,
          description: 'Delete the user named Priya.',
          query: "DELETE FROM users WHERE name = 'Priya';",
          hint: 'Use the name column in the WHERE condition.',
        },
        {
          id: 3,
          description: 'Delete the user named Amit.',
          query: "DELETE FROM users WHERE name = 'Amit';",
          hint: "Use DELETE FROM users WHERE name = 'Amit'.",
        },
        {
          id: 4,
          description: 'Delete the user named Neha.',
          query: "DELETE FROM users WHERE name = 'Neha';",
          hint: 'Use the WHERE clause to identify Neha.',
        },
        {
          id: 5,
          description: 'Delete the user named Karan.',
          query: "DELETE FROM users WHERE name = 'Karan';",
          hint: 'Use DELETE FROM users and add a WHERE condition for Karan.',
        },
      ],
    },
    {
      id: 9,
      name: 'Lesson 9',
      title: 'ALTER Statement - Modifying Table Structure',
      description:
        'Learn how to modify the structure of an existing table using the ALTER statement.',

      content: {
        points: [
          'The ALTER statement is used to modify the structure of an existing table.',
          'It allows us to add, modify, or remove columns from a table.',
          'ALTER TABLE is commonly used when we need to change the design of a table.',
          'We can use ALTER TABLE to add a new column to an existing table.',
          'We can also remove an existing column using DROP COLUMN.',
          'ALTER changes the table structure, while UPDATE changes the data stored in the table.',
        ],

        syntax: 'ALTER TABLE table_name\nADD column_name datatype;',

        example: 'ALTER TABLE users\nADD phone VARCHAR(15);',

        explanation: [
          'ALTER TABLE users tells SQL that we want to change the structure of the users table.',
          'ADD is used to add a new column to the table.',
          'phone is the name of the new column.',
          'VARCHAR(15) specifies that the phone column can store text with a maximum length of 15 characters.',
          'After executing the statement, the users table will contain the new phone column.',
          'ALTER changes the structure of the table, not the existing records directly.',
        ],
      },

      query: 'ALTER TABLE users ADD phone VARCHAR(15);',

      hint: 'Use ALTER TABLE followed by the table name, ADD, the new column name and its datatype.',

      difficulty: 'Medium',

      quiz: {
        question: 'Which SQL statement is used to modify the structure of an existing table?',
        options: ['UPDATE', 'ALTER TABLE', 'INSERT INTO', 'SELECT'],
        correctAnswer: 1,
        explanation: 'ALTER TABLE is used to modify the structure of an existing table.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Add a phone column to the users table with VARCHAR(15) datatype.',
          query: 'ALTER TABLE users ADD phone VARCHAR(15);',
          hint: 'Use ALTER TABLE users ADD followed by the column name and datatype.',
        },
        {
          id: 2,
          description: 'Add an address column to the users table with VARCHAR(100) datatype.',
          query: 'ALTER TABLE users ADD address VARCHAR(100);',
          hint: 'Use ADD address VARCHAR(100).',
        },
        {
          id: 3,
          description: 'Add a city column to the users table with VARCHAR(50) datatype.',
          query: 'ALTER TABLE users ADD city VARCHAR(50);',
          hint: 'Use ALTER TABLE, ADD, city and VARCHAR(50).',
        },
        {
          id: 4,
          description: 'Add a phone column to the customers table with VARCHAR(15) datatype.',
          query: 'ALTER TABLE customers ADD phone VARCHAR(15);',
          hint: 'Change the table name to customers.',
        },
        {
          id: 5,
          description: 'Add a department column to the users table with VARCHAR(50) datatype.',
          query: 'ALTER TABLE users ADD department VARCHAR(50);',
          hint: 'Use ADD department VARCHAR(50).',
        },
      ],
    },
    {
      id: 10,
      name: 'Lesson 10',
      title: 'CREATE TABLE Statement - Creating a Table',
      description:
        'Learn how to create a new table in a database using the CREATE TABLE statement.',

      content: {
        points: [
          'The CREATE TABLE statement is used to create a new table in a database.',
          'A table contains columns that define the type of data that can be stored.',
          'While creating a table, we specify the column names and their data types.',
          'Each column can have a different datatype such as INT, VARCHAR, DATE, etc.',
          'CREATE TABLE is a DDL statement because it changes the structure of the database.',
          'A table should have a meaningful name that describes the data it will store.',
        ],

        syntax:
          'CREATE TABLE table_name (\n  column1 datatype,\n  column2 datatype,\n  column3 datatype\n);',

        example: 'CREATE TABLE students (\n  id INT,\n  name VARCHAR(50),\n  age INT\n);',

        explanation: [
          'CREATE TABLE students tells SQL that we want to create a new table named students.',
          'id INT creates an id column that stores integer values.',
          'name VARCHAR(50) creates a name column that can store text.',
          'age INT creates an age column that stores integer values.',
          'The brackets contain the columns and their datatypes.',
          'After successfully executing the statement, a new students table is created.',
        ],
      },

      query: 'CREATE TABLE students (id INT, name VARCHAR(50), age INT);',

      hint: 'Use CREATE TABLE followed by the table name and define each column with its datatype.',

      difficulty: 'Easy',

      quiz: {
        question: 'Which SQL statement is used to create a new table?',
        options: ['CREATE TABLE', 'INSERT INTO', 'ALTER TABLE', 'UPDATE'],
        correctAnswer: 0,
        explanation: 'CREATE TABLE is used to create a new table in a database.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table with id INT, name VARCHAR(50), and age INT.',
          query: 'CREATE TABLE students (id INT, name VARCHAR(50), age INT);',
          hint: 'Use CREATE TABLE students and define the three columns.',
        },
        {
          id: 2,
          description: 'Create a teachers table with id INT and name VARCHAR(50).',
          query: 'CREATE TABLE teachers (id INT, name VARCHAR(50));',
          hint: 'Use CREATE TABLE followed by the table name and column definitions.',
        },
        {
          id: 3,
          description: 'Create a courses table with id INT and course_name VARCHAR(100).',
          query: 'CREATE TABLE courses (id INT, course_name VARCHAR(100));',
          hint: 'Define id as INT and course_name as VARCHAR(100).',
        },
        {
          id: 4,
          description: 'Create a departments table with id INT and department_name VARCHAR(50).',
          query: 'CREATE TABLE departments (id INT, department_name VARCHAR(50));',
          hint: 'Use CREATE TABLE departments with the required columns.',
        },
        {
          id: 5,
          description: 'Create a books table with id INT, title VARCHAR(100), and price INT.',
          query: 'CREATE TABLE books (id INT, title VARCHAR(100), price INT);',
          hint: 'Define id, title and price with their respective datatypes.',
        },
      ],
    },
    {
      id: 11,
      name: 'Lesson 11',
      title: 'DROP TABLE Statement - Removing a Table',
      description:
        'Learn how to remove an existing table from a database using the DROP TABLE statement.',

      content: {
        points: [
          'The DROP TABLE statement is used to completely remove an existing table from a database.',
          'It removes the table structure as well as all the records stored inside the table.',
          'After a table is dropped, the table no longer exists in the database.',
          'DROP TABLE is different from DELETE because DELETE removes records while keeping the table.',
          'DROP TABLE is also different from ALTER because ALTER modifies the table structure instead of removing the table.',
          'DROP TABLE should be used carefully because the table and its data are removed.',
        ],

        syntax: 'DROP TABLE table_name;',

        example: 'DROP TABLE students;',

        explanation: [
          'DROP TABLE tells SQL that we want to remove an entire table.',
          'students is the name of the table that we want to remove.',
          'After executing the statement, the students table will no longer exist.',
          'The records stored inside the table are also removed.',
          'Unlike DELETE, DROP TABLE removes the complete table structure.',
        ],
      },

      query: 'DROP TABLE students;',

      hint: 'Use DROP TABLE followed by the name of the table you want to remove.',

      difficulty: 'Medium',

      quiz: {
        question: 'Which SQL statement is used to completely remove a table?',
        options: ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'ALTER TABLE'],
        correctAnswer: 2,
        explanation: 'DROP TABLE is used to completely remove a table and its data.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Drop the students table.',
          query: 'DROP TABLE students;',
          hint: 'Use DROP TABLE followed by the table name.',
        },
        {
          id: 2,
          description: 'Drop the teachers table.',
          query: 'DROP TABLE teachers;',
          hint: 'Use DROP TABLE teachers.',
        },
        {
          id: 3,
          description: 'Drop the courses table.',
          query: 'DROP TABLE courses;',
          hint: 'Use DROP TABLE followed by courses.',
        },
        {
          id: 4,
          description: 'Drop the departments table.',
          query: 'DROP TABLE departments;',
          hint: 'Use DROP TABLE departments.',
        },
        {
          id: 5,
          description: 'Drop the books table.',
          query: 'DROP TABLE books;',
          hint: 'Use DROP TABLE followed by books.',
        },
      ],
    },
    {
      id: 12,
      name: 'Lesson 12',
      title: 'TRUNCATE Statement - Removing All Records',
      description: 'Learn how to remove all records from a table using the TRUNCATE statement.',

      content: {
        points: [
          'The TRUNCATE statement is used to remove all records from a table.',
          'It removes all rows but keeps the table structure.',
          'After TRUNCATE, the table still exists and can be used again.',
          'TRUNCATE does not use a WHERE clause because it removes all records.',
          'TRUNCATE is different from DELETE because DELETE can remove selected rows using WHERE.',
          'TRUNCATE is different from DROP because DROP removes the complete table structure.',
        ],

        syntax: 'TRUNCATE TABLE table_name;',

        example: 'TRUNCATE TABLE students;',

        explanation: [
          'TRUNCATE TABLE tells SQL that we want to remove all records from a table.',
          'students is the name of the table whose records will be removed.',
          'All rows from the students table will be removed.',
          'The students table itself will still exist after TRUNCATE.',
          'Unlike DROP TABLE, TRUNCATE does not remove the table structure.',
          'Unlike DELETE, TRUNCATE does not allow us to select individual records using WHERE.',
        ],
      },

      query: 'TRUNCATE TABLE students;',

      hint: 'Use TRUNCATE TABLE followed by the name of the table whose records you want to remove.',

      difficulty: 'Medium',

      quiz: {
        question: 'What does TRUNCATE TABLE remove?',
        options: [
          'The entire database',
          'The table structure only',
          'All records from a table',
          'Only one record',
        ],
        correctAnswer: 2,
        explanation: 'TRUNCATE removes all records from a table while keeping the table structure.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Remove all records from the students table.',
          query: 'TRUNCATE TABLE students;',
          hint: 'Use TRUNCATE TABLE followed by students.',
        },
        {
          id: 2,
          description: 'Remove all records from the teachers table.',
          query: 'TRUNCATE TABLE teachers;',
          hint: 'Use TRUNCATE TABLE teachers.',
        },
        {
          id: 3,
          description: 'Remove all records from the courses table.',
          query: 'TRUNCATE TABLE courses;',
          hint: 'Use TRUNCATE TABLE followed by courses.',
        },
        {
          id: 4,
          description: 'Remove all records from the departments table.',
          query: 'TRUNCATE TABLE departments;',
          hint: 'Use TRUNCATE TABLE departments.',
        },
        {
          id: 5,
          description: 'Remove all records from the books table.',
          query: 'TRUNCATE TABLE books;',
          hint: 'Use TRUNCATE TABLE followed by books.',
        },
      ],
    },
    {
      id: 13,
      name: 'Lesson 13',
      title: 'DISTINCT Statement - Removing Duplicate Values',
      description: 'Learn how to display only unique values from a column using DISTINCT.',

      content: {
        points: [
          'The DISTINCT keyword is used to remove duplicate values from the result.',
          'It displays only unique values from the selected column or columns.',
          'DISTINCT is useful when the same value appears multiple times in a table.',
          'It is written immediately after the SELECT keyword.',
          'DISTINCT does not delete duplicate records from the actual table.',
          'It only removes duplicate values from the query result.',
        ],

        syntax: 'SELECT DISTINCT column_name\nFROM table_name;',

        example: 'SELECT DISTINCT department\nFROM employees;',

        explanation: [
          'SELECT DISTINCT tells SQL that we want only unique values.',
          'department is the column from which we want to find unique values.',
          'FROM employees tells SQL to get the data from the employees table.',
          'If the same department appears multiple times, it will be displayed only once.',
          'DISTINCT changes only the displayed result; it does not remove data from the table.',
        ],
      },

      query: 'SELECT DISTINCT department FROM employees;',

      hint: 'Write DISTINCT immediately after SELECT and then specify the column name.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the purpose of DISTINCT in SQL?',
        options: [
          'To delete records',
          'To display unique values',
          'To create a table',
          'To sort records',
        ],
        correctAnswer: 1,
        explanation:
          'DISTINCT is used to display only unique values and remove duplicates from the query result.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display unique departments from the employees table.',
          query: 'SELECT DISTINCT department FROM employees;',
          hint: 'Use SELECT DISTINCT followed by department.',
        },
        {
          id: 2,
          description: 'Display unique names from the employees table.',
          query: 'SELECT DISTINCT name FROM employees;',
          hint: 'Use DISTINCT with the name column.',
        },
        {
          id: 3,
          description: 'Display unique statuses from the orders table.',
          query: 'SELECT DISTINCT status FROM orders;',
          hint: 'Use DISTINCT with the status column.',
        },
        {
          id: 4,
          description: 'Display unique ages from the users table.',
          query: 'SELECT DISTINCT age FROM users;',
          hint: 'Use DISTINCT with the age column.',
        },
        {
          id: 5,
          description: 'Display unique prices from the products table.',
          query: 'SELECT DISTINCT price FROM products;',
          hint: 'Use DISTINCT with the price column.',
        },
      ],
    },
    {
      id: 14,
      name: 'Lesson 14',
      title: 'OR Operator - Using Alternative Conditions',
      description:
        'Learn how to use the OR operator to filter records based on alternative conditions.',

      content: {
        points: [
          'The OR operator is used to combine two or more conditions in a SQL query.',
          'It returns a record when at least one of the specified conditions is true.',
          'OR is commonly used with the WHERE clause.',
          'It is useful when we want to search for records matching different conditions.',
          'Multiple OR conditions can be used in the same SQL query.',
          'Unlike AND, OR does not require all conditions to be true.',
        ],

        syntax: 'SELECT column1, column2\nFROM table_name\nWHERE condition1 OR condition2;',

        example: 'SELECT * FROM users\nWHERE age < 20 OR age > 30;',

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM users tells SQL to retrieve data from the users table.',
          'WHERE age < 20 checks whether the age is less than 20.',
          'OR age > 30 checks whether the age is greater than 30.',
          'A user will be displayed if either one of these conditions is true.',
          'OR is useful when we want to allow more than one possible condition.',
        ],
      },

      query: 'SELECT * FROM users WHERE age < 20 OR age > 30;',

      hint: 'Use WHERE followed by the first condition, then OR and the second condition.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does the OR operator do in SQL?',
        options: [
          'Requires all conditions to be true',
          'Returns records when at least one condition is true',
          'Deletes records',
          'Creates a new table',
        ],
        correctAnswer: 1,
        explanation:
          'The OR operator returns records when at least one of the specified conditions is true.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display users whose age is less than 20 or greater than 30.',
          query: 'SELECT * FROM users WHERE age < 20 OR age > 30;',
          hint: 'Use two age conditions connected with OR.',
        },
        {
          id: 2,
          description: 'Display products whose price is less than 100 or stock is greater than 50.',
          query: 'SELECT * FROM products WHERE price < 100 OR stock > 50;',
          hint: 'Use price and stock conditions with OR.',
        },
        {
          id: 3,
          description: 'Display employees who work in IT or HR.',
          query: "SELECT * FROM employees WHERE department = 'IT' OR department = 'HR';",
          hint: 'Use two department conditions connected with OR.',
        },
        {
          id: 4,
          description: 'Display orders whose status is Completed or Pending.',
          query: "SELECT * FROM orders WHERE status = 'Completed' OR status = 'Pending';",
          hint: 'Use two status conditions with OR.',
        },
        {
          id: 5,
          description: 'Display users whose age is 18 or 25.',
          query: 'SELECT * FROM users WHERE age = 18 OR age = 25;',
          hint: 'Use two age conditions connected with OR.',
        },
      ],
    },
    {
      id: 15,
      name: 'Lesson 15',
      title: 'NOT Operator - Excluding Conditions',
      description: 'Learn how to use the NOT operator to exclude records that match a condition.',

      content: {
        points: [
          'The NOT operator is used to reverse the result of a condition.',
          'It returns records that do not satisfy the specified condition.',
          'NOT is commonly used with the WHERE clause.',
          'It is useful when we want to exclude specific values or conditions.',
          'NOT can be used with conditions such as IN, LIKE and other comparison conditions.',
          'NOT helps us filter out unwanted records from the result.',
        ],

        syntax: 'SELECT column1, column2\nFROM table_name\nWHERE NOT condition;',

        example: "SELECT * FROM employees\nWHERE NOT department = 'IT';",

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM employees tells SQL to retrieve data from the employees table.',
          'NOT reverses the condition that follows it.',
          "department = 'IT' identifies employees who work in the IT department.",
          "NOT department = 'IT' excludes IT employees from the result.",
          'The result contains employees who do not belong to the IT department.',
        ],
      },

      query: "SELECT * FROM employees WHERE NOT department = 'IT';",

      hint: 'Use NOT before the condition that you want to exclude.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is the purpose of the NOT operator in SQL?',
        options: [
          'To add a new record',
          'To reverse or exclude a condition',
          'To sort records',
          'To create a table',
        ],
        correctAnswer: 1,
        explanation:
          'NOT reverses a condition and can be used to exclude records that match that condition.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display employees who do not work in the IT department.',
          query: "SELECT * FROM employees WHERE NOT department = 'IT';",
          hint: 'Use NOT before the department condition.',
        },
        {
          id: 2,
          description: 'Display users whose age is not 25.',
          query: 'SELECT * FROM users WHERE NOT age = 25;',
          hint: 'Use NOT before the age condition.',
        },
        {
          id: 3,
          description: 'Display products whose stock is not 0.',
          query: 'SELECT * FROM products WHERE NOT stock = 0;',
          hint: 'Use NOT before the stock condition.',
        },
        {
          id: 4,
          description: 'Display orders whose status is not Pending.',
          query: "SELECT * FROM orders WHERE NOT status = 'Pending';",
          hint: 'Use NOT before the status condition.',
        },
        {
          id: 5,
          description: 'Display customers who are not active.',
          query: 'SELECT * FROM customers WHERE NOT is_active = 1;',
          hint: 'Use NOT before the is_active condition.',
        },
      ],
    },
    {
      id: 16,
      name: 'Lesson 16',
      title: 'IN Operator - Matching Multiple Values',
      description: 'Learn how to use the IN operator to match multiple possible values.',

      content: {
        points: [
          'The IN operator is used to check whether a value matches any value in a given list.',
          'It is commonly used with the WHERE clause.',
          'IN makes queries shorter and easier to read when checking multiple values.',
          'It can be used with text, numbers, and other suitable values.',
          'The IN operator is an alternative to writing multiple OR conditions.',
          'If a column value matches any value in the IN list, that record is included in the result.',
        ],

        syntax:
          'SELECT column1, column2\nFROM table_name\nWHERE column_name IN (value1, value2, value3);',

        example: "SELECT * FROM employees\nWHERE department IN ('IT', 'HR');",

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM employees tells SQL to retrieve data from the employees table.',
          'WHERE department IN checks the department column against the given list.',
          "'IT' and 'HR' are the values we want to match.",
          'Employees belonging to either IT or HR will be displayed.',
          "IN is simpler than writing department = 'IT' OR department = 'HR'.",
        ],
      },

      query: "SELECT * FROM employees WHERE department IN ('IT', 'HR');",

      hint: 'Use IN after the column name and put the possible values inside parentheses.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the purpose of the IN operator in SQL?',
        options: [
          'To create a table',
          'To match a value with multiple possible values',
          'To delete a table',
          'To sort records',
        ],
        correctAnswer: 1,
        explanation: 'IN is used to check whether a value matches any value from a specified list.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display employees who work in IT or HR.',
          query: "SELECT * FROM employees WHERE department IN ('IT', 'HR');",
          hint: 'Use IN with IT and HR.',
        },
        {
          id: 2,
          description: 'Display users whose age is 20, 25, or 30.',
          query: 'SELECT * FROM users WHERE age IN (20, 25, 30);',
          hint: 'Put the three ages inside IN parentheses.',
        },
        {
          id: 3,
          description: 'Display products whose stock is 10, 20, or 30.',
          query: 'SELECT * FROM products WHERE stock IN (10, 20, 30);',
          hint: 'Use IN with the stock column.',
        },
        {
          id: 4,
          description: 'Display orders whose status is Pending or Completed.',
          query: "SELECT * FROM orders WHERE status IN ('Pending', 'Completed');",
          hint: 'Use IN with the two status values.',
        },
        {
          id: 5,
          description: 'Display customers whose id is 1, 2, or 3.',
          query: 'SELECT * FROM customers WHERE id IN (1, 2, 3);',
          hint: 'Use IN with the id column and the three numbers.',
        },
      ],
    },
    {
      id: 17,
      name: 'Lesson 17',
      title: 'BETWEEN Operator - Selecting a Range',
      description:
        'Learn how to use the BETWEEN operator to filter values within a specific range.',

      content: {
        points: [
          'The BETWEEN operator is used to select values within a specific range.',
          'It is commonly used with the WHERE clause.',
          'BETWEEN includes both the starting value and the ending value.',
          'It can be used with numbers, dates, and other comparable values.',
          'BETWEEN is useful when we want to find records within a particular range.',
          'The NOT BETWEEN operator can be used when we want values outside a specific range.',
        ],

        syntax:
          'SELECT column1, column2\nFROM table_name\nWHERE column_name BETWEEN value1 AND value2;',

        example: 'SELECT * FROM users\nWHERE age BETWEEN 20 AND 30;',

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM users tells SQL to retrieve data from the users table.',
          'WHERE age BETWEEN 20 AND 30 filters users whose age is within the specified range.',
          'BETWEEN includes both 20 and 30.',
          'For example, users with ages 20, 25 and 30 can be included in the result.',
          'BETWEEN makes range-based filtering easier to write.',
        ],
      },

      query: 'SELECT * FROM users WHERE age BETWEEN 20 AND 30;',

      hint: 'Use BETWEEN after the column name and specify the lower and upper values using AND.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the BETWEEN operator used for?',
        options: [
          'Creating a table',
          'Selecting values within a range',
          'Deleting a table',
          'Sorting records',
        ],
        correctAnswer: 1,
        explanation: 'BETWEEN is used to filter values that fall within a specified range.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display users whose age is between 20 and 30.',
          query: 'SELECT * FROM users WHERE age BETWEEN 20 AND 30;',
          hint: 'Use BETWEEN 20 AND 30 with the age column.',
        },
        {
          id: 2,
          description: 'Display products whose price is between 100 and 500.',
          query: 'SELECT * FROM products WHERE price BETWEEN 100 AND 500;',
          hint: 'Use BETWEEN with the price column.',
        },
        {
          id: 3,
          description: 'Display employees whose salary is between 30000 and 60000.',
          query: 'SELECT * FROM employees WHERE salary BETWEEN 30000 AND 60000;',
          hint: 'Use BETWEEN with the salary column.',
        },
        {
          id: 4,
          description: 'Display orders whose customer_id is between 1 and 5.',
          query: 'SELECT * FROM orders WHERE customer_id BETWEEN 1 AND 5;',
          hint: 'Use BETWEEN with customer_id.',
        },
        {
          id: 5,
          description: 'Display customers whose id is between 1 and 3.',
          query: 'SELECT * FROM customers WHERE id BETWEEN 1 AND 3;',
          hint: 'Use BETWEEN with the id column.',
        },
      ],
    },
    {
      id: 18,
      name: 'Lesson 18',
      title: 'LIKE Operator - Pattern Matching',
      description:
        'Learn how to search for records that match a specific pattern using the LIKE operator.',

      content: {
        points: [
          'The LIKE operator is used to search for a specific pattern in text values.',
          'It is commonly used with the WHERE clause.',
          'The % wildcard represents zero or more characters.',
          'The _ wildcard represents exactly one character.',
          'LIKE is useful when we do not know the complete text value.',
          'LIKE can be used to search for names, emails, departments and other text data.',
        ],

        syntax: 'SELECT column1, column2\nFROM table_name\nWHERE column_name LIKE pattern;',

        example: "SELECT * FROM users\nWHERE name LIKE 'A%';",

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM users tells SQL to retrieve data from the users table.',
          "WHERE name LIKE 'A%' searches for names that start with the letter A.",
          'The % symbol means that any number of characters can appear after A.',
          'For example, names such as Amit or Ankit can match this pattern.',
          'LIKE is useful for pattern-based searching instead of exact matching.',
        ],
      },

      query: "SELECT * FROM users WHERE name LIKE 'A%';",

      hint: 'Use LIKE after the column name and use % as a wildcard for multiple characters.',

      difficulty: 'Medium',

      quiz: {
        question: 'Which wildcard represents zero or more characters with LIKE?',
        options: ['_', '%', '#', '*'],
        correctAnswer: 1,
        explanation: 'The % wildcard represents zero or more characters when used with LIKE.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display users whose name starts with A.',
          query: "SELECT * FROM users WHERE name LIKE 'A%';",
          hint: 'Use A followed by %.',
        },
        {
          id: 2,
          description: 'Display users whose name ends with a.',
          query: "SELECT * FROM users WHERE name LIKE '%a';",
          hint: 'Put % before the letter a.',
        },
        {
          id: 3,
          description: 'Display users whose name contains the letter h.',
          query: "SELECT * FROM users WHERE name LIKE '%h%';",
          hint: 'Put % before and after h.',
        },
        {
          id: 4,
          description: 'Display employees whose department starts with I.',
          query: "SELECT * FROM employees WHERE department LIKE 'I%';",
          hint: 'Use I followed by %.',
        },
        {
          id: 5,
          description: 'Display customers whose email ends with gmail.com.',
          query: "SELECT * FROM customers WHERE email LIKE '%gmail.com';",
          hint: 'Put % before gmail.com.',
        },
      ],
    },
    {
      id: 19,
      name: 'Lesson 19',
      title: 'IS NULL - Checking Missing Values',
      description:
        'Learn how to find records where a column contains a NULL value using the IS NULL operator.',

      content: {
        points: [
          'IS NULL is used to check whether a column contains a NULL value.',
          'NULL represents missing, unknown, or unavailable data in a table.',
          'IS NULL is commonly used with the WHERE clause.',
          'It returns only the records where the specified column has a NULL value.',
          'We cannot use = NULL to check for NULL values.',
          'IS NULL is useful when we want to find records with missing information.',
        ],

        syntax: 'SELECT column1, column2\nFROM table_name\nWHERE column_name IS NULL;',

        example: 'SELECT * FROM users\nWHERE email IS NULL;',

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM users tells SQL to retrieve the records from the users table.',
          'WHERE email IS NULL checks whether the email column contains a NULL value.',
          'Only users whose email information is missing will be displayed.',
          'IS NULL is specifically used for checking missing values.',
          'The = operator should not be used to compare a column with NULL.',
        ],
      },

      query: 'SELECT * FROM users WHERE email IS NULL;',

      hint: 'Use IS NULL after the column name to find records where the value is missing.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is IS NULL used for in SQL?',
        options: [
          'To sort records',
          'To find records with missing values',
          'To delete a table',
          'To create a new column',
        ],
        correctAnswer: 1,
        explanation: 'IS NULL is used to find records where a column contains a NULL value.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display users whose email is NULL.',
          query: 'SELECT * FROM users WHERE email IS NULL;',
          hint: 'Use IS NULL with the email column.',
        },
        {
          id: 2,
          description: 'Display users whose age is NULL.',
          query: 'SELECT * FROM users WHERE age IS NULL;',
          hint: 'Use IS NULL with the age column.',
        },
        {
          id: 3,
          description: 'Display employees whose department is NULL.',
          query: 'SELECT * FROM employees WHERE department IS NULL;',
          hint: 'Use IS NULL with the department column.',
        },
        {
          id: 4,
          description: 'Display products whose stock is NULL.',
          query: 'SELECT * FROM products WHERE stock IS NULL;',
          hint: 'Use IS NULL with the stock column.',
        },
        {
          id: 5,
          description: 'Display customers whose email is NULL.',
          query: 'SELECT * FROM customers WHERE email IS NULL;',
          hint: 'Use IS NULL with the email column.',
        },
      ],
    },
    {
      id: 20,
      name: 'Lesson 20',
      title: 'IS NOT NULL - Checking Available Values',
      description:
        'Learn how to find records where a column contains a value using the IS NOT NULL operator.',

      content: {
        points: [
          'IS NOT NULL is used to check whether a column contains a value instead of NULL.',
          'It returns records where the specified column is not missing a value.',
          'IS NOT NULL is commonly used with the WHERE clause.',
          'It is useful when we want to find records that contain available information.',
          'IS NOT NULL is the opposite of IS NULL.',
          'We cannot use != NULL or <> NULL to check for NULL values.',
        ],

        syntax: 'SELECT column1, column2\nFROM table_name\nWHERE column_name IS NOT NULL;',

        example: 'SELECT * FROM users\nWHERE email IS NOT NULL;',

        explanation: [
          'SELECT * tells SQL to display all columns.',
          'FROM users tells SQL to retrieve records from the users table.',
          'WHERE email IS NOT NULL checks that the email column contains a value.',
          'Only users whose email information is available will be displayed.',
          'IS NOT NULL is used when we want to exclude records with missing values.',
          'IS NOT NULL is the opposite of IS NULL.',
        ],
      },

      query: 'SELECT * FROM users WHERE email IS NOT NULL;',

      hint: 'Use IS NOT NULL after the column name to find records where the value is available.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is IS NOT NULL used for in SQL?',
        options: [
          'To find records with missing values',
          'To find records where a value is present',
          'To delete records',
          'To sort records',
        ],
        correctAnswer: 1,
        explanation:
          'IS NOT NULL is used to find records where the specified column contains a value.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display users whose email is not NULL.',
          query: 'SELECT * FROM users WHERE email IS NOT NULL;',
          hint: 'Use IS NOT NULL with the email column.',
        },
        {
          id: 2,
          description: 'Display users whose age is not NULL.',
          query: 'SELECT * FROM users WHERE age IS NOT NULL;',
          hint: 'Use IS NOT NULL with the age column.',
        },
        {
          id: 3,
          description: 'Display employees whose department is not NULL.',
          query: 'SELECT * FROM employees WHERE department IS NOT NULL;',
          hint: 'Use IS NOT NULL with the department column.',
        },
        {
          id: 4,
          description: 'Display products whose stock is not NULL.',
          query: 'SELECT * FROM products WHERE stock IS NOT NULL;',
          hint: 'Use IS NOT NULL with the stock column.',
        },
        {
          id: 5,
          description: 'Display customers whose email is not NULL.',
          query: 'SELECT * FROM customers WHERE email IS NOT NULL;',
          hint: 'Use IS NOT NULL with the email column.',
        },
      ],
    },
    {
      id: 21,
      name: 'Lesson 21',
      title: 'SQL Functions - Introduction',
      description: 'Learn what SQL functions are and why they are used in SQL queries.',

      content: {
        points: [
          'SQL functions are built-in operations used to perform calculations or manipulate data.',
          'Functions can work with numbers, text, dates, and table records.',
          'They help us perform common tasks without writing complex SQL statements.',
          'A function usually accepts one or more values as input and returns a result.',
          'SQL functions are commonly used with the SELECT statement.',
          'Functions can be used to calculate, count, modify, or format data.',
        ],

        syntax: 'SELECT function_name(column_name)\nFROM table_name;',

        example: 'SELECT COUNT(*)\nFROM users;',

        explanation: [
          'SELECT tells SQL that we want to retrieve a result.',
          'COUNT() is a SQL function used to count records.',
          'The * inside COUNT() means that all rows should be counted.',
          'FROM users tells SQL to count the records from the users table.',
          'The function performs an operation on the data and returns the result.',
          'SQL has different types of functions such as aggregate, string, numeric, and date functions.',
        ],
      },

      query: 'SELECT COUNT(*) FROM users;',

      hint: 'Use a SQL function with SELECT. COUNT() is an example of an aggregate function.',

      difficulty: 'Easy',

      quiz: {
        question: 'What are SQL functions used for?',
        options: [
          'Only creating tables',
          'Performing operations on data',
          'Only deleting records',
          'Only sorting records',
        ],
        correctAnswer: 1,
        explanation:
          'SQL functions are used to perform different operations on data and return a result.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Count all records in the users table.',
          query: 'SELECT COUNT(*) FROM users;',
          hint: 'Use the COUNT() function with *.',
        },
        {
          id: 2,
          description: 'Count all records in the products table.',
          query: 'SELECT COUNT(*) FROM products;',
          hint: 'Use COUNT(*) with the products table.',
        },
        {
          id: 3,
          description: 'Count all records in the employees table.',
          query: 'SELECT COUNT(*) FROM employees;',
          hint: 'Use COUNT(*) with employees.',
        },
        {
          id: 4,
          description: 'Count all records in the orders table.',
          query: 'SELECT COUNT(*) FROM orders;',
          hint: 'Use COUNT(*) with orders.',
        },
        {
          id: 5,
          description: 'Count all records in the customers table.',
          query: 'SELECT COUNT(*) FROM customers;',
          hint: 'Use COUNT(*) with customers.',
        },
      ],
    },
    {
      id: 22,
      name: 'Lesson 22',
      title: 'Aggregate Functions - Performing Calculations',
      description:
        'Learn how aggregate functions are used to perform calculations on multiple records and return a single result.',

      content: {
        points: [
          'Aggregate functions perform calculations on a group of rows.',
          'They return a single result based on multiple records.',
          'Aggregate functions are commonly used with the SELECT statement.',
          'Common aggregate functions include COUNT(), SUM(), AVG(), MIN(), and MAX().',
          'COUNT() is used to count records.',
          'SUM() is used to calculate the total of numeric values.',
          'AVG() is used to calculate the average of numeric values.',
          'MIN() returns the smallest value, while MAX() returns the largest value.',
        ],

        syntax: 'SELECT aggregate_function(column_name)\nFROM table_name;',

        example: 'SELECT AVG(age)\nFROM users;',

        explanation: [
          'SELECT tells SQL that we want to retrieve a calculated result.',
          'AVG(age) calculates the average value of the age column.',
          'FROM users tells SQL to use the data from the users table.',
          'The aggregate function processes multiple rows and returns a single result.',
          'SQL provides several aggregate functions for different types of calculations.',
          'Aggregate functions are useful when we want summary information instead of individual records.',
        ],
      },

      query: 'SELECT AVG(age) FROM users;',

      hint: 'Use an aggregate function such as COUNT(), SUM(), AVG(), MIN(), or MAX() with SELECT.',

      difficulty: 'Easy',

      quiz: {
        question: 'Which of the following is an aggregate function in SQL?',
        options: ['COUNT()', 'SELECT()', 'WHERE()', 'ORDER()'],
        correctAnswer: 0,
        explanation: 'COUNT() is an aggregate function used to calculate the number of records.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Count all records in the users table.',
          query: 'SELECT COUNT(*) FROM users;',
          hint: 'Use COUNT(*) with the users table.',
        },
        {
          id: 2,
          description: 'Calculate the total price of all products.',
          query: 'SELECT SUM(price) FROM products;',
          hint: 'Use SUM() with the price column.',
        },
        {
          id: 3,
          description: 'Calculate the average age of users.',
          query: 'SELECT AVG(age) FROM users;',
          hint: 'Use AVG() with the age column.',
        },
        {
          id: 4,
          description: 'Find the minimum salary of employees.',
          query: 'SELECT MIN(salary) FROM employees;',
          hint: 'Use MIN() with the salary column.',
        },
        {
          id: 5,
          description: 'Find the maximum salary of employees.',
          query: 'SELECT MAX(salary) FROM employees;',
          hint: 'Use MAX() with the salary column.',
        },
      ],
    },
    {
      id: 23,
      name: 'Lesson 23',
      title: 'COUNT() Function - Counting Records',
      description: 'Learn how to count records and values in a table using the COUNT() function.',

      content: {
        points: [
          'The COUNT() function is used to count records or values in a table.',
          'COUNT(*) counts all rows in a table.',
          'COUNT(column_name) counts the non-NULL values in the specified column.',
          'COUNT() is an aggregate function because it works on multiple rows and returns a single result.',
          'It is commonly used with the SELECT statement.',
          'COUNT() is useful when we want to know how many records are present.',
        ],

        syntax: 'SELECT COUNT(column_name)\nFROM table_name;',

        example: 'SELECT COUNT(*)\nFROM users;',

        explanation: [
          'SELECT COUNT(*) tells SQL to count the records.',
          'The * means that all rows in the users table will be counted.',
          'FROM users tells SQL to count the records from the users table.',
          'The result is a single number representing the total number of rows.',
          'COUNT(column_name) can also be used to count non-NULL values in a specific column.',
        ],
      },

      query: 'SELECT COUNT(*) FROM users;',

      hint: 'Use COUNT(*) to count all records in a table.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does COUNT(*) count?',
        options: [
          'Only NULL values',
          'All rows in a table',
          'Only the first row',
          'Only column names',
        ],
        correctAnswer: 1,
        explanation: 'COUNT(*) counts all rows in the specified table.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Count all records in the users table.',
          query: 'SELECT COUNT(*) FROM users;',
          hint: 'Use COUNT(*) with users.',
        },
        {
          id: 2,
          description: 'Count all records in the products table.',
          query: 'SELECT COUNT(*) FROM products;',
          hint: 'Use COUNT(*) with products.',
        },
        {
          id: 3,
          description: 'Count all employees in the employees table.',
          query: 'SELECT COUNT(*) FROM employees;',
          hint: 'Use COUNT(*) with employees.',
        },
        {
          id: 4,
          description: 'Count all orders in the orders table.',
          query: 'SELECT COUNT(*) FROM orders;',
          hint: 'Use COUNT(*) with orders.',
        },
        {
          id: 5,
          description: 'Count all customers in the customers table.',
          query: 'SELECT COUNT(*) FROM customers;',
          hint: 'Use COUNT(*) with customers.',
        },
      ],
    },
    {
      id: 24,
      name: 'Lesson 24',
      title: 'SUM() Function - Calculating Total',
      description: 'Learn how to calculate the total of numeric values using the SUM() function.',

      content: {
        points: [
          'The SUM() function is used to calculate the total of numeric values in a column.',
          'It is an aggregate function because it works on multiple rows and returns a single result.',
          'SUM() is commonly used with numeric columns such as price, salary, stock, and age.',
          'It adds together the available numeric values in the specified column.',
          'SUM() is commonly used with the SELECT statement.',
          'It is useful when we want to find the total value of a column.',
        ],

        syntax: 'SELECT SUM(column_name)\nFROM table_name;',

        example: 'SELECT SUM(price)\nFROM products;',

        explanation: [
          'SELECT SUM(price) tells SQL to calculate the total of the price values.',
          'FROM products tells SQL to use the data from the products table.',
          'SUM(price) adds the numeric values stored in the price column.',
          'The result is a single number representing the total price.',
          'SUM() is useful for calculating totals such as total sales, total salary, or total stock.',
        ],
      },

      query: 'SELECT SUM(price) FROM products;',

      hint: 'Use SUM() around the numeric column whose values you want to add together.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the SUM() function used for?',
        options: [
          'Finding the total of numeric values',
          'Counting records',
          'Sorting records',
          'Deleting records',
        ],
        correctAnswer: 0,
        explanation: 'SUM() is used to calculate the total of numeric values in a column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Calculate the total price of all products.',
          query: 'SELECT SUM(price) FROM products;',
          hint: 'Use SUM() with the price column.',
        },
        {
          id: 2,
          description: 'Calculate the total stock of all products.',
          query: 'SELECT SUM(stock) FROM products;',
          hint: 'Use SUM() with the stock column.',
        },
        {
          id: 3,
          description: 'Calculate the total salary of all employees.',
          query: 'SELECT SUM(salary) FROM employees;',
          hint: 'Use SUM() with the salary column.',
        },
        {
          id: 4,
          description: 'Calculate the total age of all users.',
          query: 'SELECT SUM(age) FROM users;',
          hint: 'Use SUM() with the age column.',
        },
        {
          id: 5,
          description: 'Calculate the total customer IDs.',
          query: 'SELECT SUM(id) FROM customers;',
          hint: 'Use SUM() with the id column.',
        },
      ],
    },
    {
      id: 25,
      name: 'Lesson 25',
      title: 'AVG() Function - Calculating Average',
      description: 'Learn how to calculate the average of numeric values using the AVG() function.',

      content: {
        points: [
          'The AVG() function is used to calculate the average value of a numeric column.',
          'It is an aggregate function because it works on multiple rows and returns a single result.',
          'AVG() is commonly used with numeric columns such as age, price, and salary.',
          'It calculates the average of the available numeric values in the specified column.',
          'AVG() is commonly used with the SELECT statement.',
          'It is useful when we want to find the average value of a group of records.',
        ],

        syntax: 'SELECT AVG(column_name)\nFROM table_name;',

        example: 'SELECT AVG(age)\nFROM users;',

        explanation: [
          'SELECT AVG(age) tells SQL to calculate the average of the age values.',
          'FROM users tells SQL to use the data from the users table.',
          'AVG(age) calculates the average value of the age column.',
          'The result is a single number representing the average age.',
          'AVG() is useful for finding averages such as average age, average salary, or average price.',
        ],
      },

      query: 'SELECT AVG(age) FROM users;',

      hint: 'Use AVG() around the numeric column whose average you want to calculate.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the AVG() function used for?',
        options: [
          'Calculating the average of numeric values',
          'Counting records',
          'Deleting records',
          'Sorting records',
        ],
        correctAnswer: 0,
        explanation: 'AVG() is used to calculate the average value of a numeric column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Calculate the average age of all users.',
          query: 'SELECT AVG(age) FROM users;',
          hint: 'Use AVG() with the age column.',
        },
        {
          id: 2,
          description: 'Calculate the average price of all products.',
          query: 'SELECT AVG(price) FROM products;',
          hint: 'Use AVG() with the price column.',
        },
        {
          id: 3,
          description: 'Calculate the average salary of all employees.',
          query: 'SELECT AVG(salary) FROM employees;',
          hint: 'Use AVG() with the salary column.',
        },
        {
          id: 4,
          description: 'Calculate the average stock of all products.',
          query: 'SELECT AVG(stock) FROM products;',
          hint: 'Use AVG() with the stock column.',
        },
        {
          id: 5,
          description: 'Calculate the average customer ID.',
          query: 'SELECT AVG(id) FROM customers;',
          hint: 'Use AVG() with the id column.',
        },
      ],
    },
    {
      id: 26,
      name: 'Lesson 26',
      title: 'MIN() Function - Finding Smallest Value',
      description: 'Learn how to find the smallest value in a column using the MIN() function.',

      content: {
        points: [
          'The MIN() function is used to find the smallest value in a column.',
          'It is an aggregate function because it works on multiple rows and returns a single result.',
          'MIN() can be used with numeric, date, and text columns.',
          'It helps identify the lowest value in a dataset.',
          'MIN() is commonly used with the SELECT statement.',
          'It is useful for finding the minimum salary, lowest price, youngest age, or earliest date.',
        ],

        syntax: 'SELECT MIN(column_name)\nFROM table_name;',

        example: 'SELECT MIN(price)\nFROM products;',

        explanation: [
          'SELECT MIN(price) tells SQL to find the smallest value in the price column.',
          'FROM products tells SQL to use data from the products table.',
          'MIN(price) checks all price values and returns the lowest one.',
          'The result is a single value representing the minimum price.',
          'MIN() is useful when comparing values and finding the smallest record.',
        ],
      },

      query: 'SELECT MIN(price) FROM products;',

      hint: 'Use MIN() with the column whose smallest value you want to find.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does the MIN() function return?',
        options: [
          'The highest value',
          'The average value',
          'The smallest value',
          'The total value',
        ],
        correctAnswer: 2,
        explanation: 'MIN() returns the smallest value from the specified column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Find the lowest product price.',
          query: 'SELECT MIN(price) FROM products;',
          hint: 'Use MIN() with the price column.',
        },
        {
          id: 2,
          description: 'Find the minimum age of users.',
          query: 'SELECT MIN(age) FROM users;',
          hint: 'Use MIN() with the age column.',
        },
        {
          id: 3,
          description: 'Find the lowest employee salary.',
          query: 'SELECT MIN(salary) FROM employees;',
          hint: 'Use MIN() with the salary column.',
        },
        {
          id: 4,
          description: 'Find the minimum stock available.',
          query: 'SELECT MIN(stock) FROM products;',
          hint: 'Use MIN() with the stock column.',
        },
        {
          id: 5,
          description: 'Find the smallest customer ID.',
          query: 'SELECT MIN(id) FROM customers;',
          hint: 'Use MIN() with the id column.',
        },
      ],
    },
    {
      id: 27,
      name: 'Lesson 27',
      title: 'MAX() Function - Finding Largest Value',
      description: 'Learn how to find the largest value in a column using the MAX() function.',

      content: {
        points: [
          'The MAX() function is used to find the largest value in a column.',
          'It is an aggregate function because it works on multiple rows and returns a single result.',
          'MAX() can be used with numeric, date, and text columns.',
          'It helps identify the highest value in a dataset.',
          'MAX() is commonly used with the SELECT statement.',
          'It is useful for finding the highest salary, highest price, or greatest age.',
        ],

        syntax: 'SELECT MAX(column_name)\nFROM table_name;',

        example: 'SELECT MAX(price)\nFROM products;',

        explanation: [
          'SELECT MAX(price) tells SQL to find the largest value in the price column.',
          'FROM products tells SQL to use data from the products table.',
          'MAX(price) checks all price values and returns the highest one.',
          'The result is a single value representing the maximum price.',
          'MAX() is useful when we want to find the highest value from a group of records.',
        ],
      },

      query: 'SELECT MAX(price) FROM products;',

      hint: 'Use MAX() with the column whose largest value you want to find.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does the MAX() function return?',
        options: [
          'The smallest value',
          'The average value',
          'The total value',
          'The largest value',
        ],
        correctAnswer: 3,
        explanation: 'MAX() returns the largest value from the specified column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Find the highest product price.',
          query: 'SELECT MAX(price) FROM products;',
          hint: 'Use MAX() with the price column.',
        },
        {
          id: 2,
          description: 'Find the maximum age of users.',
          query: 'SELECT MAX(age) FROM users;',
          hint: 'Use MAX() with the age column.',
        },
        {
          id: 3,
          description: 'Find the highest employee salary.',
          query: 'SELECT MAX(salary) FROM employees;',
          hint: 'Use MAX() with the salary column.',
        },
        {
          id: 4,
          description: 'Find the maximum stock available.',
          query: 'SELECT MAX(stock) FROM products;',
          hint: 'Use MAX() with the stock column.',
        },
        {
          id: 5,
          description: 'Find the largest customer ID.',
          query: 'SELECT MAX(id) FROM customers;',
          hint: 'Use MAX() with the id column.',
        },
      ],
    },
    {
      id: 28,
      name: 'Lesson 28',
      title: 'String Functions - Working with Text',
      description:
        'Learn how string functions are used to perform operations on text values in SQL.',

      content: {
        points: [
          'String functions are used to perform operations on text values.',
          'They can be used to modify, combine, search, or format text data.',
          'String functions are commonly used with the SELECT statement.',
          'Examples of string functions include UPPER(), LOWER(), CONCAT(), LENGTH(), and SUBSTRING().',
          'String functions usually return a new text value as the result.',
          'They do not permanently change the original data unless the result is used in an UPDATE statement.',
        ],

        syntax: 'SELECT string_function(column_name)\nFROM table_name;',

        example: 'SELECT LOWER(name)\nFROM users;',

        explanation: [
          'SELECT tells SQL that we want to retrieve a result.',
          'LOWER() is a string function that converts text into lowercase.',
          'name is the column containing the text value.',
          'FROM users tells SQL to use the name values from the users table.',
          'The function changes the displayed result but does not permanently change the original data.',
          'Different string functions can be used depending on the operation we want to perform on text.',
        ],
      },

      query: 'SELECT LOWER(name) FROM users;',

      hint: 'Use a string function with a text column. For example, LOWER() can convert text to lowercase.',

      difficulty: 'Easy',

      quiz: {
        question: 'What are string functions used for in SQL?',
        options: [
          'Performing operations on text values',
          'Creating databases',
          'Deleting tables',
          'Sorting only numeric values',
        ],
        correctAnswer: 0,
        explanation: 'String functions are used to perform different operations on text values.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display all user names in lowercase.',
          query: 'SELECT LOWER(name) FROM users;',
          hint: 'Use LOWER() with the name column.',
        },
        {
          id: 2,
          description: 'Display all employee names in uppercase.',
          query: 'SELECT UPPER(name) FROM employees;',
          hint: 'Use UPPER() with the name column.',
        },
        {
          id: 3,
          description: 'Combine the name and email of users.',
          query: 'SELECT CONCAT(name, email) FROM users;',
          hint: 'Use CONCAT() with name and email.',
        },
        {
          id: 4,
          description: 'Display all customer names in uppercase.',
          query: 'SELECT UPPER(name) FROM customers;',
          hint: 'Use UPPER() with the customer name column.',
        },
        {
          id: 5,
          description: 'Display employee names in lowercase.',
          query: 'SELECT LOWER(name) FROM employees;',
          hint: 'Use LOWER() with the employee name column.',
        },
      ],
    },
    {
      id: 29,
      name: 'Lesson 29',
      title: 'Numeric Functions - Working with Numbers',
      description:
        'Learn how numeric functions are used to perform operations on numeric values in SQL.',

      content: {
        points: [
          'Numeric functions are used to perform operations on numeric values.',
          'They are useful for calculations and manipulating numbers in SQL queries.',
          'Numeric functions can be used with columns that contain numeric data.',
          'Common numeric functions include ABS(), ROUND(), CEIL(), and FLOOR().',
          'Numeric functions are commonly used with the SELECT statement.',
          'They return a calculated or modified numeric value without changing the original data.',
        ],

        syntax: 'SELECT numeric_function(column_name)\nFROM table_name;',

        example: 'SELECT ROUND(price)\nFROM products;',

        explanation: [
          'SELECT tells SQL that we want to retrieve a result.',
          'ROUND(price) is a numeric function that rounds the price value.',
          'price is the numeric column on which the function is applied.',
          'FROM products tells SQL to use the price values from the products table.',
          'The function returns a modified numeric result.',
          'Numeric functions are useful for calculations and formatting numeric data.',
        ],
      },

      query: 'SELECT ROUND(price) FROM products;',

      hint: 'Use a numeric function with a numeric column. For example, ROUND() can round a numeric value.',

      difficulty: 'Easy',

      quiz: {
        question: 'What are numeric functions used for in SQL?',
        options: [
          'Performing operations on numeric values',
          'Creating tables',
          'Deleting databases',
          'Only modifying text',
        ],
        correctAnswer: 0,
        explanation:
          'Numeric functions are used to perform different operations on numeric values.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Round the prices of all products.',
          query: 'SELECT ROUND(price) FROM products;',
          hint: 'Use ROUND() with the price column.',
        },
        {
          id: 2,
          description: 'Find the absolute value of all customer IDs.',
          query: 'SELECT ABS(id) FROM customers;',
          hint: 'Use ABS() with the id column.',
        },
        {
          id: 3,
          description: 'Round the salaries of all employees.',
          query: 'SELECT ROUND(salary) FROM employees;',
          hint: 'Use ROUND() with the salary column.',
        },
        {
          id: 4,
          description: 'Find the absolute value of user ages.',
          query: 'SELECT ABS(age) FROM users;',
          hint: 'Use ABS() with the age column.',
        },
        {
          id: 5,
          description: 'Round the stock values of all products.',
          query: 'SELECT ROUND(stock) FROM products;',
          hint: 'Use ROUND() with the stock column.',
        },
      ],
    },
    {
      id: 30,
      name: 'Lesson 30',
      title: 'Date & Time Functions - Working with Dates',
      description:
        'Learn how date and time functions are used to work with date and time values in SQL.',

      content: {
        points: [
          'Date and time functions are used to work with date and time values in SQL.',
          'They can be used to retrieve, format, compare, or perform calculations with dates and times.',
          'Date and time functions are commonly used with columns that store dates.',
          'Common examples include CURRENT_DATE, CURRENT_TIME, and CURRENT_TIMESTAMP.',
          'These functions are useful when working with information such as order dates, registration dates, and other time-related data.',
          'The exact date and time functions available can vary between different SQL database systems.',
        ],

        syntax: 'SELECT date_time_function();',

        example: 'SELECT CURRENT_DATE;',

        explanation: [
          'SELECT tells SQL that we want to retrieve a result.',
          'CURRENT_DATE returns the current date.',
          'The function does not require a table when we only want to retrieve the current date.',
          'Date and time functions are useful for working with dates and times stored in databases.',
          'Different database systems may provide different date and time functions.',
        ],
      },

      query: 'SELECT CURRENT_DATE;',

      hint: 'Use SELECT with a date and time function such as CURRENT_DATE.',

      difficulty: 'Easy',

      quiz: {
        question: 'What are date and time functions used for in SQL?',
        options: [
          'Working with date and time values',
          'Creating tables only',
          'Deleting records only',
          'Sorting text only',
        ],
        correctAnswer: 0,
        explanation:
          'Date and time functions are used to retrieve and work with date and time values.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display the current date.',
          query: 'SELECT CURRENT_DATE;',
          hint: 'Use CURRENT_DATE with SELECT.',
        },
        {
          id: 2,
          description: 'Display the current time.',
          query: 'SELECT CURRENT_TIME;',
          hint: 'Use CURRENT_TIME with SELECT.',
        },
        {
          id: 3,
          description: 'Display the current date and time.',
          query: 'SELECT CURRENT_TIMESTAMP;',
          hint: 'Use CURRENT_TIMESTAMP with SELECT.',
        },
        {
          id: 4,
          description: 'Display the current date.',
          query: 'SELECT CURRENT_DATE;',
          hint: 'Use CURRENT_DATE.',
        },
        {
          id: 5,
          description: 'Display the current date and time using a timestamp.',
          query: 'SELECT CURRENT_TIMESTAMP;',
          hint: 'Use CURRENT_TIMESTAMP with SELECT.',
        },
      ],
    },
    {
      id: 31,
      name: 'Lesson 31',
      title: 'GROUP BY - Grouping Records',
      description: 'Learn how to group rows with the same values using the GROUP BY clause.',

      content: {
        points: [
          'The GROUP BY clause is used to group rows that have the same values in a specified column.',
          'It is commonly used with aggregate functions such as COUNT(), SUM(), AVG(), MIN(), and MAX().',
          'GROUP BY returns one result for each group.',
          'It is useful when we want summary information for different categories.',
          'For example, we can group employees according to their department.',
          'GROUP BY is commonly used with the SELECT statement and aggregate functions.',
        ],

        syntax:
          'SELECT column_name, aggregate_function(column_name)\nFROM table_name\nGROUP BY column_name;',

        example: 'SELECT department, COUNT(*)\nFROM employees\nGROUP BY department;',

        explanation: [
          'SELECT department tells SQL to display each department.',
          'COUNT(*) counts the number of employees in each department.',
          'FROM employees tells SQL to use the employees table.',
          'GROUP BY department groups employees who belong to the same department.',
          'The result shows each department along with the number of employees in that department.',
          'GROUP BY is useful for creating summaries based on categories.',
        ],
      },

      query: 'SELECT department, COUNT(*) FROM employees GROUP BY department;',

      hint: 'Use GROUP BY after FROM and specify the column you want to group the records by.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is the purpose of GROUP BY in SQL?',
        options: [
          'To delete records',
          'To group rows with the same values',
          'To create a new table',
          'To sort records only',
        ],
        correctAnswer: 1,
        explanation: 'GROUP BY groups rows that have the same values in a specified column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Count the number of employees in each department.',
          query: 'SELECT department, COUNT(*) FROM employees GROUP BY department;',
          hint: 'Group employees by department and use COUNT(*).',
        },
        {
          id: 2,
          description: 'Find the total salary for each department.',
          query: 'SELECT department, SUM(salary) FROM employees GROUP BY department;',
          hint: 'Use SUM(salary) and GROUP BY department.',
        },
        {
          id: 3,
          description: 'Find the average salary for each department.',
          query: 'SELECT department, AVG(salary) FROM employees GROUP BY department;',
          hint: 'Use AVG(salary) and group by department.',
        },
        {
          id: 4,
          description: 'Count the number of orders for each status.',
          query: 'SELECT status, COUNT(*) FROM orders GROUP BY status;',
          hint: 'Group orders by status and use COUNT(*).',
        },
        {
          id: 5,
          description: 'Find the total stock for each product name.',
          query: 'SELECT name, SUM(stock) FROM products GROUP BY name;',
          hint: 'Use SUM(stock) and GROUP BY name.',
        },
      ],
    },
    {
      id: 32,
      name: 'Lesson 32',
      title: 'HAVING - Filtering Groups',
      description: 'Learn how to filter grouped results using the HAVING clause.',

      content: {
        points: [
          'The HAVING clause is used to filter groups created using GROUP BY.',
          'It is commonly used with aggregate functions such as COUNT(), SUM(), AVG(), MIN(), and MAX().',
          'HAVING is used when we want to apply a condition to grouped results.',
          'WHERE filters individual rows before grouping, while HAVING filters groups after grouping.',
          'HAVING is commonly written after the GROUP BY clause.',
          'It is useful when we want to display only groups that satisfy a specific condition.',
        ],

        syntax:
          'SELECT column_name, aggregate_function(column_name)\nFROM table_name\nGROUP BY column_name\nHAVING condition;',

        example:
          'SELECT department, COUNT(*)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 2;',

        explanation: [
          'SELECT department tells SQL to display each department.',
          'COUNT(*) counts the employees in each department.',
          'FROM employees tells SQL to use the employees table.',
          'GROUP BY department creates groups based on department.',
          'HAVING COUNT(*) > 2 keeps only departments that have more than 2 employees.',
          'HAVING filters the grouped results after GROUP BY is performed.',
        ],
      },

      query: 'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 2;',

      hint: 'Use HAVING after GROUP BY to apply a condition to the grouped results.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is the HAVING clause used for?',
        options: [
          'Filtering individual rows',
          'Filtering grouped results',
          'Creating a table',
          'Deleting a database',
        ],
        correctAnswer: 1,
        explanation: 'HAVING is used to filter groups created using GROUP BY.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display departments having more than 2 employees.',
          query:
            'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 2;',
          hint: 'Group by department and use HAVING with COUNT(*).',
        },
        {
          id: 2,
          description: 'Display departments having more than 1 employee.',
          query:
            'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 1;',
          hint: 'Use COUNT(*) > 1 with HAVING.',
        },
        {
          id: 3,
          description: 'Display departments whose total salary is greater than 50000.',
          query:
            'SELECT department, SUM(salary) FROM employees GROUP BY department HAVING SUM(salary) > 50000;',
          hint: 'Use SUM(salary) with HAVING.',
        },
        {
          id: 4,
          description: 'Display departments whose average salary is greater than 30000.',
          query:
            'SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 30000;',
          hint: 'Use AVG(salary) with HAVING.',
        },
        {
          id: 5,
          description: 'Display order statuses having more than 2 orders.',
          query: 'SELECT status, COUNT(*) FROM orders GROUP BY status HAVING COUNT(*) > 2;',
          hint: 'Group by status and filter using HAVING COUNT(*).',
        },
      ],
    },
    {
      id: 33,
      name: 'Lesson 33',
      title: 'GROUP BY with Aggregate Functions',
      description:
        'Learn how to use GROUP BY together with aggregate functions to generate summary results for different groups.',

      content: {
        points: [
          'GROUP BY can be used together with aggregate functions to create summary information for different groups.',
          'Aggregate functions such as COUNT(), SUM(), AVG(), MIN(), and MAX() can be used with GROUP BY.',
          'GROUP BY divides the rows into groups based on the specified column.',
          'The aggregate function then performs a calculation for each group.',
          'Each group produces a separate result.',
          'GROUP BY with aggregate functions is useful for analysing data category by category.',
        ],

        syntax:
          'SELECT column_name, aggregate_function(column_name)\nFROM table_name\nGROUP BY column_name;',

        example: 'SELECT department, AVG(salary)\nFROM employees\nGROUP BY department;',

        explanation: [
          'SELECT department tells SQL to display each department.',
          'AVG(salary) calculates the average salary for each department.',
          'FROM employees tells SQL to use the employees table.',
          'GROUP BY department creates separate groups for each department.',
          'The AVG() function then calculates the average salary separately for every department.',
          'The result contains one row for each department with its average salary.',
        ],
      },

      query: 'SELECT department, AVG(salary) FROM employees GROUP BY department;',

      hint: 'Select the grouping column and an aggregate function, then use GROUP BY with the same grouping column.',

      difficulty: 'Medium',

      quiz: {
        question: 'What happens when an aggregate function is used with GROUP BY?',
        options: [
          'The table is deleted',
          'The calculation is performed separately for each group',
          'All records are removed',
          'A new database is created',
        ],
        correctAnswer: 1,
        explanation:
          'GROUP BY creates groups and the aggregate function performs the calculation separately for each group.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Count employees in each department.',
          query: 'SELECT department, COUNT(*) FROM employees GROUP BY department;',
          hint: 'Use COUNT(*) and GROUP BY department.',
        },
        {
          id: 2,
          description: 'Find the total salary for each department.',
          query: 'SELECT department, SUM(salary) FROM employees GROUP BY department;',
          hint: 'Use SUM(salary) and GROUP BY department.',
        },
        {
          id: 3,
          description: 'Find the average salary for each department.',
          query: 'SELECT department, AVG(salary) FROM employees GROUP BY department;',
          hint: 'Use AVG(salary) and GROUP BY department.',
        },
        {
          id: 4,
          description: 'Find the highest salary in each department.',
          query: 'SELECT department, MAX(salary) FROM employees GROUP BY department;',
          hint: 'Use MAX(salary) and GROUP BY department.',
        },
        {
          id: 5,
          description: 'Find the lowest salary in each department.',
          query: 'SELECT department, MIN(salary) FROM employees GROUP BY department;',
          hint: 'Use MIN(salary) and GROUP BY department.',
        },
      ],
    },
    {
      id: 34,
      name: 'Lesson 34',
      title: 'WHERE vs HAVING - Difference',
      description:
        'Learn the difference between WHERE and HAVING clauses and understand when to use each one.',

      content: {
        points: [
          'WHERE is used to filter individual rows before grouping.',
          'HAVING is used to filter groups after GROUP BY is applied.',
          'WHERE is generally used with conditions on individual column values.',
          'HAVING is commonly used with aggregate functions such as COUNT(), SUM(), AVG(), MIN(), and MAX().',
          'WHERE comes before GROUP BY in a query.',
          'HAVING comes after GROUP BY in a query.',
          'Both WHERE and HAVING are used to filter data, but they work at different stages of the query.',
        ],

        syntax:
          'SELECT column_name, aggregate_function(column_name)\nFROM table_name\nWHERE condition\nGROUP BY column_name\nHAVING aggregate_condition;',

        example:
          'SELECT department, COUNT(*)\nFROM employees\nWHERE salary > 30000\nGROUP BY department\nHAVING COUNT(*) > 1;',

        explanation: [
          'WHERE salary > 30000 first selects only employees whose salary is greater than 30000.',
          'GROUP BY department then groups those employees according to their department.',
          'COUNT(*) counts the employees in each department.',
          'HAVING COUNT(*) > 1 keeps only departments that have more than one employee.',
          'WHERE filters individual records before grouping.',
          'HAVING filters the groups after GROUP BY has been performed.',
        ],
      },

      query:
        'SELECT department, COUNT(*) FROM employees WHERE salary > 30000 GROUP BY department HAVING COUNT(*) > 1;',

      hint: 'Use WHERE to filter rows before GROUP BY and HAVING to filter groups after GROUP BY.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is the main difference between WHERE and HAVING?',
        options: [
          'WHERE filters rows and HAVING filters groups',
          'WHERE creates tables and HAVING deletes tables',
          'WHERE sorts data and HAVING creates groups',
          'There is no difference',
        ],
        correctAnswer: 0,
        explanation:
          'WHERE filters individual rows before grouping, while HAVING filters groups after GROUP BY.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Display departments having more than 1 employee after filtering employees with salary greater than 30000.',
          query:
            'SELECT department, COUNT(*) FROM employees WHERE salary > 30000 GROUP BY department HAVING COUNT(*) > 1;',
          hint: 'Use WHERE before GROUP BY and HAVING after GROUP BY.',
        },
        {
          id: 2,
          description:
            'Display departments having more than 2 employees whose salary is greater than 25000.',
          query:
            'SELECT department, COUNT(*) FROM employees WHERE salary > 25000 GROUP BY department HAVING COUNT(*) > 2;',
          hint: 'First filter salary using WHERE, then use GROUP BY and HAVING.',
        },
        {
          id: 3,
          description:
            'Display departments whose total salary is greater than 50000, considering employees with salary greater than 20000.',
          query:
            'SELECT department, SUM(salary) FROM employees WHERE salary > 20000 GROUP BY department HAVING SUM(salary) > 50000;',
          hint: 'Use WHERE for salary filtering and HAVING for SUM(salary).',
        },
        {
          id: 4,
          description:
            'Display departments having an average salary greater than 30000, considering employees with salary greater than 20000.',
          query:
            'SELECT department, AVG(salary) FROM employees WHERE salary > 20000 GROUP BY department HAVING AVG(salary) > 30000;',
          hint: 'Use WHERE before GROUP BY and HAVING with AVG().',
        },
        {
          id: 5,
          description:
            'Display order statuses having more than 1 order with customer_id greater than 2.',
          query:
            'SELECT status, COUNT(*) FROM orders WHERE customer_id > 2 GROUP BY status HAVING COUNT(*) > 1;',
          hint: 'Use WHERE to filter customer_id and HAVING to filter the groups.',
        },
      ],
    },
    {
      id: 35,
      name: 'Lesson 35',
      title: 'Keys - Identifying Records',
      description: 'Learn what keys are and why they are important in a database.',

      content: {
        points: [
          'A key is a column or a combination of columns used to identify records in a database.',
          'Keys help uniquely identify records in a table.',
          'They help establish relationships between different tables.',
          'Keys help maintain the accuracy and integrity of data.',
          'A table can have different types of keys depending on how the data is organized.',
          'Common types of keys include Primary Key, Foreign Key, Candidate Key, Alternate Key, and Composite Key.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype PRIMARY KEY\n);',

        example: 'CREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  name VARCHAR(50)\n);',

        explanation: [
          'student_id is used to identify each student uniquely.',
          'PRIMARY KEY makes student_id the key of the students table.',
          'Each student should have a different student_id.',
          'The name column stores the student name.',
          'Keys help identify records and create relationships between tables.',
          'Different types of keys are used for different database requirements.',
        ],
      },

      query: 'CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(50));',

      hint: 'A key is used to identify records. A PRIMARY KEY is one common type of key.',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the main purpose of a key in a database?',
        options: [
          'To identify records',
          'To delete records',
          'To sort records only',
          'To display images',
        ],
        correctAnswer: 0,
        explanation:
          'Keys are used to identify records and help maintain relationships and data integrity.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table with student_id as the primary key.',
          query: 'CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(50));',
          hint: 'Use student_id INT PRIMARY KEY.',
        },
        {
          id: 2,
          description: 'Create a teachers table with teacher_id as the primary key.',
          query: 'CREATE TABLE teachers (teacher_id INT PRIMARY KEY, name VARCHAR(50));',
          hint: 'Use teacher_id as the PRIMARY KEY.',
        },
        {
          id: 3,
          description: 'Create a courses table with course_id as the primary key.',
          query: 'CREATE TABLE courses (course_id INT PRIMARY KEY, course_name VARCHAR(100));',
          hint: 'Use course_id INT PRIMARY KEY.',
        },
        {
          id: 4,
          description: 'Create a books table with book_id as the primary key.',
          query: 'CREATE TABLE books (book_id INT PRIMARY KEY, title VARCHAR(100));',
          hint: 'Use book_id as the PRIMARY KEY.',
        },
        {
          id: 5,
          description: 'Create a departments table with department_id as the primary key.',
          query:
            'CREATE TABLE departments (department_id INT PRIMARY KEY, department_name VARCHAR(50));',
          hint: 'Use department_id INT PRIMARY KEY.',
        },
      ],
    },
    {
      id: 36,
      name: 'Lesson 36',
      title: 'Primary Key - Uniquely Identifying Records',
      description: 'Learn how a Primary Key uniquely identifies each record in a table.',

      content: {
        points: [
          'A Primary Key is a column or combination of columns that uniquely identifies each record in a table.',
          'Each value in a Primary Key must be unique.',
          'A Primary Key cannot contain NULL values.',
          'A table can have only one Primary Key constraint.',
          'A Primary Key helps prevent duplicate records.',
          'Primary Keys are also useful for creating relationships between tables.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype PRIMARY KEY\n);',

        example:
          'CREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  name VARCHAR(50),\n  age INT\n);',

        explanation: [
          'student_id is declared as the PRIMARY KEY.',
          'Each student must have a unique student_id.',
          'Two students cannot have the same student_id.',
          'The Primary Key cannot contain NULL values.',
          'The name and age columns store other information about the student.',
          'Primary Keys help SQL identify each record uniquely.',
        ],
      },

      query: 'CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(50), age INT);',

      hint: 'Use PRIMARY KEY after the column definition that should uniquely identify each record.',

      difficulty: 'Easy',

      quiz: {
        question: 'Which statement about a Primary Key is correct?',
        options: [
          'It can contain duplicate values',
          'It can contain NULL values',
          'It uniquely identifies each record',
          'It is used only for sorting records',
        ],
        correctAnswer: 2,
        explanation:
          'A Primary Key uniquely identifies each record and cannot contain duplicate or NULL values.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table with student_id as the Primary Key.',
          query: 'CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(50), age INT);',
          hint: 'Use student_id INT PRIMARY KEY.',
        },
        {
          id: 2,
          description: 'Create an employees table with employee_id as the Primary Key.',
          query:
            'CREATE TABLE employees (employee_id INT PRIMARY KEY, name VARCHAR(50), salary INT);',
          hint: 'Use employee_id as the PRIMARY KEY.',
        },
        {
          id: 3,
          description: 'Create a products table with product_id as the Primary Key.',
          query: 'CREATE TABLE products (product_id INT PRIMARY KEY, name VARCHAR(50), price INT);',
          hint: 'Use product_id INT PRIMARY KEY.',
        },
        {
          id: 4,
          description: 'Create a courses table with course_id as the Primary Key.',
          query: 'CREATE TABLE courses (course_id INT PRIMARY KEY, course_name VARCHAR(100));',
          hint: 'Use course_id as the PRIMARY KEY.',
        },
        {
          id: 5,
          description: 'Create a books table with book_id as the Primary Key.',
          query: 'CREATE TABLE books (book_id INT PRIMARY KEY, title VARCHAR(100));',
          hint: 'Use book_id as the PRIMARY KEY.',
        },
      ],
    },
    {
      id: 37,
      name: 'Lesson 37',
      title: 'Candidate Key - Possible Unique Keys',
      description:
        'Learn what a Candidate Key is and how it can uniquely identify records in a table.',

      content: {
        points: [
          'A Candidate Key is a column or combination of columns that can uniquely identify each record in a table.',
          'A table can have more than one Candidate Key.',
          'Every Candidate Key must contain unique values.',
          'A Candidate Key cannot contain NULL values when it is used to uniquely identify records.',
          'One Candidate Key is selected as the Primary Key.',
          'The remaining Candidate Keys that are not selected as the Primary Key can become Alternate Keys.',
        ],

        syntax:
          'CREATE TABLE table_name (\n  column1 datatype UNIQUE,\n  column2 datatype UNIQUE\n);',

        example:
          'CREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  email VARCHAR(100) UNIQUE,\n  name VARCHAR(50)\n);',

        explanation: [
          'student_id can uniquely identify each student and is selected as the Primary Key.',
          'email can also uniquely identify a student because each student should have a different email address.',
          'Therefore, student_id and email can be considered possible Candidate Keys.',
          'The Primary Key is selected from the available Candidate Keys.',
          'A table may have multiple Candidate Keys but only one Primary Key.',
          'A Candidate Key must be capable of uniquely identifying each record.',
        ],
      },

      query:
        'CREATE TABLE students (student_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',

      hint: 'A Candidate Key is a possible key that can uniquely identify every record.',

      difficulty: 'Medium',

      quiz: {
        question: 'Which statement about a Candidate Key is correct?',
        options: [
          'It can contain duplicate values',
          'It can uniquely identify each record',
          'It is always a Foreign Key',
          'A table can have only one Candidate Key',
        ],
        correctAnswer: 1,
        explanation:
          'A Candidate Key is a possible key that can uniquely identify each record in a table.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Create a students table where student_id is the Primary Key and email is a possible unique key.',
          query:
            'CREATE TABLE students (student_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use PRIMARY KEY for student_id and UNIQUE for email.',
        },
        {
          id: 2,
          description:
            'Create an employees table where employee_id is the Primary Key and email is unique.',
          query:
            'CREATE TABLE employees (employee_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use employee_id as PRIMARY KEY and email as UNIQUE.',
        },
        {
          id: 3,
          description:
            'Create a customers table where customer_id is the Primary Key and email is unique.',
          query:
            'CREATE TABLE customers (customer_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use PRIMARY KEY for customer_id and UNIQUE for email.',
        },
        {
          id: 4,
          description:
            'Create a courses table where course_id is the Primary Key and course_code is unique.',
          query:
            'CREATE TABLE courses (course_id INT PRIMARY KEY, course_code VARCHAR(20) UNIQUE, course_name VARCHAR(100));',
          hint: 'Use course_id as PRIMARY KEY and course_code as UNIQUE.',
        },
        {
          id: 5,
          description: 'Create a books table where book_id is the Primary Key and isbn is unique.',
          query:
            'CREATE TABLE books (book_id INT PRIMARY KEY, isbn VARCHAR(20) UNIQUE, title VARCHAR(100));',
          hint: 'Use book_id as PRIMARY KEY and isbn as UNIQUE.',
        },
      ],
    },
    {
      id: 38,
      name: 'Lesson 38',
      title: 'Alternate Key - Other Unique Key',
      description:
        'Learn what an Alternate Key is and how it is related to Candidate Keys and the Primary Key.',

      content: {
        points: [
          'An Alternate Key is a Candidate Key that is not selected as the Primary Key.',
          'A table can have multiple Candidate Keys.',
          'Only one Candidate Key is selected as the Primary Key.',
          'The remaining Candidate Keys are called Alternate Keys.',
          'An Alternate Key can also uniquely identify records in a table.',
          'Alternate Keys help maintain uniqueness for other important columns.',
        ],

        syntax:
          'CREATE TABLE table_name (\n  primary_key_column datatype PRIMARY KEY,\n  alternate_key_column datatype UNIQUE\n);',

        example:
          'CREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  email VARCHAR(100) UNIQUE,\n  name VARCHAR(50)\n);',

        explanation: [
          'student_id is selected as the Primary Key.',
          'email can also uniquely identify a student, so it can be a Candidate Key.',
          'Since email is not selected as the Primary Key, it becomes an Alternate Key.',
          'The UNIQUE constraint helps ensure that two students do not have the same email.',
          'Therefore, an Alternate Key is basically a Candidate Key that was not chosen as the Primary Key.',
          'A table can have multiple Alternate Keys if it has multiple remaining Candidate Keys.',
        ],
      },

      query:
        'CREATE TABLE students (student_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',

      hint: 'An Alternate Key is a Candidate Key that was not selected as the Primary Key.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is an Alternate Key?',
        options: [
          'A Foreign Key used to connect tables',
          'A Candidate Key not selected as the Primary Key',
          'A key that contains duplicate values',
          'A key used only for sorting',
        ],
        correctAnswer: 1,
        explanation: 'An Alternate Key is a Candidate Key that is not selected as the Primary Key.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Create a students table with student_id as Primary Key and email as another unique key.',
          query:
            'CREATE TABLE students (student_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use student_id as PRIMARY KEY and email as UNIQUE.',
        },
        {
          id: 2,
          description:
            'Create an employees table with employee_id as Primary Key and email as another unique key.',
          query:
            'CREATE TABLE employees (employee_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use employee_id as PRIMARY KEY and email as UNIQUE.',
        },
        {
          id: 3,
          description:
            'Create a customers table with customer_id as Primary Key and email as another unique key.',
          query:
            'CREATE TABLE customers (customer_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use customer_id as PRIMARY KEY and email as UNIQUE.',
        },
        {
          id: 4,
          description:
            'Create a courses table with course_id as Primary Key and course_code as another unique key.',
          query:
            'CREATE TABLE courses (course_id INT PRIMARY KEY, course_code VARCHAR(20) UNIQUE, course_name VARCHAR(100));',
          hint: 'Use course_id as PRIMARY KEY and course_code as UNIQUE.',
        },
        {
          id: 5,
          description:
            'Create a books table with book_id as Primary Key and isbn as another unique key.',
          query:
            'CREATE TABLE books (book_id INT PRIMARY KEY, isbn VARCHAR(20) UNIQUE, title VARCHAR(100));',
          hint: 'Use book_id as PRIMARY KEY and isbn as UNIQUE.',
        },
      ],
    },
    {
      id: 39,
      name: 'Lesson 39',
      title: 'Composite Key - Combining Multiple Columns',
      description:
        'Learn how a Composite Key uses two or more columns together to uniquely identify a record.',

      content: {
        points: [
          'A Composite Key is a key made using two or more columns together.',
          'It is used when a single column cannot uniquely identify a record.',
          'The combination of the columns must uniquely identify each record.',
          'Each column in a Composite Key may contain duplicate values individually.',
          'The combination of all columns in the key must be unique.',
          'Composite Keys are useful in tables that represent relationships between entities.',
        ],

        syntax:
          'CREATE TABLE table_name (\n  column1 datatype,\n  column2 datatype,\n  PRIMARY KEY (column1, column2)\n);',

        example:
          'CREATE TABLE student_courses (\n  student_id INT,\n  course_id INT,\n  enrollment_date DATE,\n  PRIMARY KEY (student_id, course_id)\n);',

        explanation: [
          'student_id identifies a student, but the same student can enroll in multiple courses.',
          'course_id identifies a course, but many students can enroll in the same course.',
          'Therefore, neither student_id nor course_id alone can uniquely identify an enrollment.',
          'The combination of student_id and course_id uniquely identifies each student-course relationship.',
          'PRIMARY KEY (student_id, course_id) creates a Composite Key using both columns.',
          'The same student cannot have the same course combination more than once.',
        ],
      },

      query:
        'CREATE TABLE student_courses (student_id INT, course_id INT, enrollment_date DATE, PRIMARY KEY (student_id, course_id));',

      hint: 'Use two or more columns together inside PRIMARY KEY (column1, column2).',

      difficulty: 'Medium',

      quiz: {
        question: 'What is a Composite Key?',
        options: [
          'A key made using only one column',
          'A key made using two or more columns',
          'A key used only for sorting',
          'A key that always contains NULL values',
        ],
        correctAnswer: 1,
        explanation: 'A Composite Key combines two or more columns to uniquely identify a record.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Create a student_courses table using student_id and course_id as a Composite Key.',
          query:
            'CREATE TABLE student_courses (student_id INT, course_id INT, PRIMARY KEY (student_id, course_id));',
          hint: 'Put both columns inside PRIMARY KEY().',
        },
        {
          id: 2,
          description:
            'Create an order_items table using order_id and product_id as a Composite Key.',
          query:
            'CREATE TABLE order_items (order_id INT, product_id INT, quantity INT, PRIMARY KEY (order_id, product_id));',
          hint: 'Use order_id and product_id together as the Primary Key.',
        },
        {
          id: 3,
          description:
            'Create an employee_projects table using employee_id and project_id as a Composite Key.',
          query:
            'CREATE TABLE employee_projects (employee_id INT, project_id INT, PRIMARY KEY (employee_id, project_id));',
          hint: 'Use both employee_id and project_id inside PRIMARY KEY().',
        },
        {
          id: 4,
          description:
            'Create a course_teachers table using course_id and teacher_id as a Composite Key.',
          query:
            'CREATE TABLE course_teachers (course_id INT, teacher_id INT, PRIMARY KEY (course_id, teacher_id));',
          hint: 'Combine course_id and teacher_id in the Primary Key.',
        },
        {
          id: 5,
          description:
            'Create a product_suppliers table using product_id and supplier_id as a Composite Key.',
          query:
            'CREATE TABLE product_suppliers (product_id INT, supplier_id INT, PRIMARY KEY (product_id, supplier_id));',
          hint: 'Use product_id and supplier_id together as the Composite Key.',
        },
      ],
    },
    {
      id: 40,
      name: 'Lesson 40',
      title: 'NOT NULL - Preventing Missing Values',
      description:
        'Learn how the NOT NULL constraint ensures that a column cannot contain NULL values.',

      content: {
        points: [
          'The NOT NULL constraint prevents a column from containing NULL values.',
          'It ensures that a value must be provided when a record is inserted.',
          'NOT NULL is useful for columns where information is required.',
          'A column can be defined with NOT NULL while creating a table.',
          'NOT NULL helps maintain complete and reliable data.',
          'It can be applied to columns such as name, email, phone number, or other required information.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype NOT NULL\n);',

        example: 'CREATE TABLE students (\n  student_id INT,\n  name VARCHAR(50) NOT NULL\n);',

        explanation: [
          'student_id stores the ID of the student.',
          'name is defined with the NOT NULL constraint.',
          'This means the name column cannot contain a NULL value.',
          'When inserting a student record, a value must be provided for name.',
          'NOT NULL is useful when a particular piece of information is mandatory.',
          'The constraint helps prevent missing values in important columns.',
        ],
      },

      query: 'CREATE TABLE students (student_id INT, name VARCHAR(50) NOT NULL);',

      hint: 'Add NOT NULL after the datatype of the column that must always contain a value.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does the NOT NULL constraint do?',
        options: [
          'Allows only duplicate values',
          'Prevents a column from containing NULL values',
          'Deletes NULL records',
          'Creates a Primary Key automatically',
        ],
        correctAnswer: 1,
        explanation: 'NOT NULL ensures that a column must contain a value and cannot contain NULL.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table where name cannot be NULL.',
          query: 'CREATE TABLE students (student_id INT, name VARCHAR(50) NOT NULL);',
          hint: 'Add NOT NULL after VARCHAR(50).',
        },
        {
          id: 2,
          description: 'Create an employees table where name cannot be NULL.',
          query: 'CREATE TABLE employees (employee_id INT, name VARCHAR(50) NOT NULL);',
          hint: 'Use NOT NULL with the name column.',
        },
        {
          id: 3,
          description: 'Create a products table where product name cannot be NULL.',
          query: 'CREATE TABLE products (product_id INT, name VARCHAR(50) NOT NULL);',
          hint: 'Make the name column NOT NULL.',
        },
        {
          id: 4,
          description: 'Create a customers table where email cannot be NULL.',
          query: 'CREATE TABLE customers (customer_id INT, email VARCHAR(100) NOT NULL);',
          hint: 'Use NOT NULL with the email column.',
        },
        {
          id: 5,
          description: 'Create a courses table where course_name cannot be NULL.',
          query: 'CREATE TABLE courses (course_id INT, course_name VARCHAR(100) NOT NULL);',
          hint: 'Make course_name NOT NULL.',
        },
      ],
    },
    {
      id: 41,
      name: 'Lesson 41',
      title: 'UNIQUE - Preventing Duplicate Values',
      description:
        'Learn how the UNIQUE constraint ensures that a column does not contain duplicate values.',

      content: {
        points: [
          'The UNIQUE constraint ensures that all values in a column are different.',
          'It prevents duplicate values from being stored in a column.',
          'UNIQUE is useful for information that should be different for every record.',
          'Common examples include email addresses, phone numbers, usernames, and identification codes.',
          'A table can have multiple UNIQUE constraints on different columns.',
          'UNIQUE is different from PRIMARY KEY because a table can have multiple UNIQUE constraints.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype UNIQUE\n);',

        example:
          'CREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  email VARCHAR(100) UNIQUE,\n  name VARCHAR(50)\n);',

        explanation: [
          'student_id is the Primary Key and uniquely identifies each student.',
          'email is defined with the UNIQUE constraint.',
          'This means two students cannot have the same email address.',
          'The UNIQUE constraint prevents duplicate email values.',
          'A table can have more than one column with a UNIQUE constraint.',
          'UNIQUE is useful when a column must contain different values for different records.',
        ],
      },

      query:
        'CREATE TABLE students (student_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',

      hint: 'Add UNIQUE after the datatype of the column where duplicate values should not be allowed.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does the UNIQUE constraint do?',
        options: [
          'Allows duplicate values',
          'Prevents duplicate values in a column',
          'Deletes duplicate rows automatically',
          'Creates a Foreign Key',
        ],
        correctAnswer: 1,
        explanation:
          'The UNIQUE constraint prevents duplicate values from being stored in a column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table where email must be unique.',
          query:
            'CREATE TABLE students (student_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Add UNIQUE to the email column.',
        },
        {
          id: 2,
          description: 'Create an employees table where email must be unique.',
          query:
            'CREATE TABLE employees (employee_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Use UNIQUE with the email column.',
        },
        {
          id: 3,
          description: 'Create a customers table where email must be unique.',
          query:
            'CREATE TABLE customers (customer_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE, name VARCHAR(50));',
          hint: 'Make the email column UNIQUE.',
        },
        {
          id: 4,
          description: 'Create a products table where product_code must be unique.',
          query:
            'CREATE TABLE products (product_id INT PRIMARY KEY, product_code VARCHAR(20) UNIQUE, name VARCHAR(50));',
          hint: 'Use UNIQUE with product_code.',
        },
        {
          id: 5,
          description: 'Create a courses table where course_code must be unique.',
          query:
            'CREATE TABLE courses (course_id INT PRIMARY KEY, course_code VARCHAR(20) UNIQUE, course_name VARCHAR(100));',
          hint: 'Make course_code UNIQUE.',
        },
      ],
    },
    {
      id: 42,
      name: 'Lesson 42',
      title: 'PRIMARY KEY Constraint - Uniquely Identifying Records',
      description:
        'Learn how the PRIMARY KEY constraint uniquely identifies each record in a table.',

      content: {
        points: [
          'The PRIMARY KEY constraint is used to uniquely identify each record in a table.',
          'A Primary Key must contain unique values.',
          'A Primary Key cannot contain NULL values.',
          'A table can have only one PRIMARY KEY constraint.',
          'The PRIMARY KEY constraint helps prevent duplicate records.',
          'A Primary Key can consist of a single column or multiple columns.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype PRIMARY KEY\n);',

        example:
          'CREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  name VARCHAR(50),\n  age INT\n);',

        explanation: [
          'student_id is defined as the PRIMARY KEY.',
          'Each student must have a unique student_id.',
          'The student_id cannot be NULL.',
          'The PRIMARY KEY constraint prevents duplicate student IDs.',
          'The name and age columns store additional student information.',
          'A PRIMARY KEY is important for uniquely identifying records in a table.',
        ],
      },

      query: 'CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(50), age INT);',

      hint: 'Use PRIMARY KEY after the datatype of the column that should uniquely identify each record.',

      difficulty: 'Easy',

      quiz: {
        question: 'Which of the following is true about a PRIMARY KEY?',
        options: [
          'It can contain duplicate values',
          'It can contain NULL values',
          'It uniquely identifies each record',
          'A table can have unlimited Primary Keys',
        ],
        correctAnswer: 2,
        explanation:
          'A PRIMARY KEY uniquely identifies each record and cannot contain duplicate or NULL values.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table with student_id as the Primary Key.',
          query: 'CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(50), age INT);',
          hint: 'Use student_id INT PRIMARY KEY.',
        },
        {
          id: 2,
          description: 'Create an employees table with employee_id as the Primary Key.',
          query:
            'CREATE TABLE employees (employee_id INT PRIMARY KEY, name VARCHAR(50), salary INT);',
          hint: 'Use employee_id as the PRIMARY KEY.',
        },
        {
          id: 3,
          description: 'Create a products table with product_id as the Primary Key.',
          query: 'CREATE TABLE products (product_id INT PRIMARY KEY, name VARCHAR(50), price INT);',
          hint: 'Use product_id as the PRIMARY KEY.',
        },
        {
          id: 4,
          description: 'Create a courses table with course_id as the Primary Key.',
          query: 'CREATE TABLE courses (course_id INT PRIMARY KEY, course_name VARCHAR(100));',
          hint: 'Use course_id as the PRIMARY KEY.',
        },
        {
          id: 5,
          description: 'Create a books table with book_id as the Primary Key.',
          query: 'CREATE TABLE books (book_id INT PRIMARY KEY, title VARCHAR(100));',
          hint: 'Use book_id as the PRIMARY KEY.',
        },
      ],
    },
    {
      id: 43,
      name: 'Lesson 43',
      title: 'FOREIGN KEY Constraint - Connecting Tables',
      description:
        'Learn how the FOREIGN KEY constraint creates a relationship between two tables.',

      content: {
        points: [
          'The FOREIGN KEY constraint is used to create a relationship between two tables.',
          'A Foreign Key usually refers to the Primary Key of another table.',
          'It helps maintain referential integrity between related tables.',
          'A Foreign Key value should match a value in the referenced table when it is not NULL.',
          'A table can have multiple Foreign Keys.',
          'Foreign Keys are commonly used when tables need to be connected.',
        ],

        syntax:
          'CREATE TABLE table_name (\n  column_name datatype,\n  FOREIGN KEY (column_name) REFERENCES other_table(column_name)\n);',

        example:
          'CREATE TABLE orders (\n  order_id INT PRIMARY KEY,\n  customer_id INT,\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n);',

        explanation: [
          'order_id is the Primary Key of the orders table.',
          'customer_id is used to identify which customer placed the order.',
          'customer_id is defined as a FOREIGN KEY.',
          'The REFERENCES clause connects customer_id with the id column of the customers table.',
          'The id column in customers should be a key that uniquely identifies a customer.',
          'This relationship helps ensure that orders are associated with valid customers.',
        ],
      },

      query:
        'CREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT, FOREIGN KEY (customer_id) REFERENCES customers(id));',

      hint: 'Use FOREIGN KEY (column) REFERENCES table(column) to connect one table with another.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is the main purpose of a FOREIGN KEY constraint?',
        options: [
          'To create a duplicate record',
          'To connect related tables',
          'To sort records',
          'To delete a table',
        ],
        correctAnswer: 1,
        explanation:
          'A FOREIGN KEY creates a relationship between tables and helps maintain referential integrity.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Create an orders table with customer_id as a Foreign Key referencing customers(id).',
          query:
            'CREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT, FOREIGN KEY (customer_id) REFERENCES customers(id));',
          hint: 'Use FOREIGN KEY (customer_id) REFERENCES customers(id).',
        },
        {
          id: 2,
          description:
            'Create an enrollments table with student_id as a Foreign Key referencing students(id).',
          query:
            'CREATE TABLE enrollments (enrollment_id INT PRIMARY KEY, student_id INT, FOREIGN KEY (student_id) REFERENCES students(id));',
          hint: 'Use student_id as the Foreign Key.',
        },
        {
          id: 3,
          description:
            'Create an employee_projects table with employee_id as a Foreign Key referencing employees(id).',
          query:
            'CREATE TABLE employee_projects (assignment_id INT PRIMARY KEY, employee_id INT, FOREIGN KEY (employee_id) REFERENCES employees(id));',
          hint: 'Use FOREIGN KEY (employee_id) REFERENCES employees(id).',
        },
        {
          id: 4,
          description:
            'Create an order_items table with order_id as a Foreign Key referencing orders(id).',
          query:
            'CREATE TABLE order_items (item_id INT PRIMARY KEY, order_id INT, FOREIGN KEY (order_id) REFERENCES orders(id));',
          hint: 'Use order_id as the Foreign Key.',
        },
        {
          id: 5,
          description:
            'Create a student_courses table with student_id as a Foreign Key referencing students(id).',
          query:
            'CREATE TABLE student_courses (record_id INT PRIMARY KEY, student_id INT, FOREIGN KEY (student_id) REFERENCES students(id));',
          hint: 'Use FOREIGN KEY (student_id) REFERENCES students(id).',
        },
      ],
    },
    {
      id: 44,
      name: 'Lesson 44',
      title: 'CHECK - Validating Data Values',
      description:
        'Learn how the CHECK constraint ensures that values entered into a column satisfy a specified condition.',

      content: {
        points: [
          'The CHECK constraint is used to make sure that values in a column satisfy a specific condition.',
          'It helps prevent invalid data from being inserted into a table.',
          'The condition is written inside the CHECK constraint.',
          'If the condition is not satisfied, the database rejects the value.',
          'CHECK can be used with numeric, text, and other suitable columns.',
          'It helps maintain accurate and valid data in a table.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype CHECK (condition)\n);',

        example:
          'CREATE TABLE students (\n  student_id INT,\n  age INT CHECK (age >= 18),\n  name VARCHAR(50)\n);',

        explanation: [
          'The age column is defined with a CHECK constraint.',
          'CHECK (age >= 18) means that the age must be 18 or greater.',
          'If someone tries to insert an age below 18, the database can reject the value.',
          'The CHECK constraint helps prevent invalid values from being stored.',
          'Different conditions can be used depending on the requirement.',
          'CHECK is useful for enforcing rules on the data stored in a table.',
        ],
      },

      query: 'CREATE TABLE students (student_id INT, age INT CHECK (age >= 18), name VARCHAR(50));',

      hint: 'Use CHECK followed by a condition, such as CHECK (age >= 18).',

      difficulty: 'Easy',

      quiz: {
        question: 'What is the purpose of the CHECK constraint?',
        options: [
          'To allow every value',
          'To validate values using a condition',
          'To delete invalid tables',
          'To sort records',
        ],
        correctAnswer: 1,
        explanation:
          'The CHECK constraint ensures that values satisfy a specified condition before they are stored.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a students table where age must be 18 or greater.',
          query:
            'CREATE TABLE students (student_id INT, age INT CHECK (age >= 18), name VARCHAR(50));',
          hint: 'Use CHECK (age >= 18).',
        },
        {
          id: 2,
          description: 'Create an employees table where salary must be greater than 10000.',
          query:
            'CREATE TABLE employees (employee_id INT, salary INT CHECK (salary > 10000), name VARCHAR(50));',
          hint: 'Use CHECK (salary > 10000).',
        },
        {
          id: 3,
          description: 'Create a products table where price must be greater than 0.',
          query:
            'CREATE TABLE products (product_id INT, price INT CHECK (price > 0), name VARCHAR(50));',
          hint: 'Use CHECK (price > 0).',
        },
        {
          id: 4,
          description: 'Create a students table where age must be between 18 and 60.',
          query:
            'CREATE TABLE students (student_id INT, age INT CHECK (age >= 18 AND age <= 60), name VARCHAR(50));',
          hint: 'Use a CHECK condition with both minimum and maximum age.',
        },
        {
          id: 5,
          description: 'Create a products table where stock cannot be negative.',
          query:
            'CREATE TABLE products (product_id INT, stock INT CHECK (stock >= 0), name VARCHAR(50));',
          hint: 'Use CHECK (stock >= 0).',
        },
      ],
    },
    {
      id: 45,
      name: 'Lesson 45',
      title: 'DEFAULT - Setting Default Values',
      description:
        'Learn how the DEFAULT constraint automatically provides a value when no value is specified.',

      content: {
        points: [
          'The DEFAULT constraint is used to assign a default value to a column.',
          'If no value is provided for that column during INSERT, the default value is automatically used.',
          'DEFAULT is useful when a column commonly has the same initial value.',
          'It can be used with different types of values such as numbers, text, and dates.',
          'DEFAULT helps reduce the need to manually enter common values.',
          'The default value is used only when a value is not provided for the column.',
        ],

        syntax: 'CREATE TABLE table_name (\n  column_name datatype DEFAULT default_value\n);',

        example:
          "CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(50),\n  status VARCHAR(20) DEFAULT 'Active'\n);",

        explanation: [
          'The status column is defined with a DEFAULT value of Active.',
          'If a new user is inserted without specifying a status, SQL automatically uses Active.',
          'For example, an INSERT statement can provide only the id and name.',
          'The database then assigns Active to the status column.',
          'If a different status is explicitly provided, that value can be stored instead.',
          'DEFAULT is useful for providing commonly used values automatically.',
        ],
      },

      query:
        "CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50), status VARCHAR(20) DEFAULT 'Active');",

      hint: 'Use DEFAULT followed by the value you want SQL to use automatically.',

      difficulty: 'Easy',

      quiz: {
        question: 'What does the DEFAULT constraint do?',
        options: [
          'Deletes a column',
          'Automatically provides a value when no value is specified',
          'Prevents duplicate values',
          'Creates a Foreign Key',
        ],
        correctAnswer: 1,
        explanation:
          'DEFAULT automatically provides the specified value when no value is given for the column.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a users table where status has a default value of Active.',
          query:
            "CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50), status VARCHAR(20) DEFAULT 'Active');",
          hint: "Use DEFAULT 'Active' for the status column.",
        },
        {
          id: 2,
          description: 'Create a products table where stock has a default value of 0.',
          query:
            'CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(50), stock INT DEFAULT 0);',
          hint: 'Use DEFAULT 0 for stock.',
        },
        {
          id: 3,
          description: 'Create an employees table where department has a default value of General.',
          query:
            "CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(50), department VARCHAR(50) DEFAULT 'General');",
          hint: "Use DEFAULT 'General' for department.",
        },
        {
          id: 4,
          description: 'Create an orders table where status has a default value of Pending.',
          query:
            "CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, status VARCHAR(20) DEFAULT 'Pending');",
          hint: "Use DEFAULT 'Pending' for status.",
        },
        {
          id: 5,
          description: 'Create a students table where city has a default value of Mumbai.',
          query:
            "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50), city VARCHAR(50) DEFAULT 'Mumbai');",
          hint: "Use DEFAULT 'Mumbai' for city.",
        },
      ],
    },
    {
      id: 46,
      name: 'Lesson 46',
      title: 'Joins - Combining Data from Tables',
      description:
        'Learn what SQL Joins are and how they are used to combine related data from multiple tables.',

      content: {
        points: [
          'A JOIN is used to combine related data from two or more tables.',
          'Joins are useful when related information is stored in different tables.',
          'Tables are usually connected using a common column.',
          'A common example is connecting customers with their orders using customer_id.',
          'SQL provides different types of joins such as INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.',
          'Joins help us retrieve related information from multiple tables in a single query.',
        ],

        syntax:
          'SELECT table1.column1, table2.column2\nFROM table1\nJOIN table2\nON table1.common_column = table2.common_column;',

        example:
          'SELECT customers.name, orders.order_id\nFROM customers\nJOIN orders\nON customers.id = orders.customer_id;',

        explanation: [
          'The customers table contains customer information.',
          'The orders table contains order information.',
          'customers.id and orders.customer_id are related columns.',
          'The JOIN combines matching records from the two tables.',
          'The ON condition tells SQL how the two tables are related.',
          'The result displays the customer name along with the related order ID.',
        ],
      },

      query:
        'SELECT customers.name, orders.order_id FROM customers JOIN orders ON customers.id = orders.customer_id;',

      hint: 'Use JOIN to combine two related tables and ON to specify the common columns.',

      difficulty: 'Medium',

      quiz: {
        question: 'What is the main purpose of a JOIN in SQL?',
        options: [
          'To delete tables',
          'To combine related data from multiple tables',
          'To create a database',
          'To sort records only',
        ],
        correctAnswer: 1,
        explanation: 'A JOIN is used to combine related data from two or more tables.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display customer names along with their order IDs.',
          query:
            'SELECT customers.name, orders.order_id FROM customers JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Join customers and orders using id and customer_id.',
        },
        {
          id: 2,
          description: 'Display customer names and their order status.',
          query:
            'SELECT customers.name, orders.status FROM customers JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Join the customers and orders tables using their related ID columns.',
        },
        {
          id: 3,
          description: 'Display customer emails along with their order IDs.',
          query:
            'SELECT customers.email, orders.order_id FROM customers JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Select email from customers and order_id from orders.',
        },
        {
          id: 4,
          description: 'Display customer names and order dates.',
          query:
            'SELECT customers.name, orders.order_date FROM customers JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use the common customer ID columns in the JOIN condition.',
        },
        {
          id: 5,
          description: 'Display customer names along with order status.',
          query:
            'SELECT customers.name, orders.status FROM customers JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use JOIN with customers and orders and connect them using id and customer_id.',
        },
      ],
    },
    {
      id: 47,
      name: 'Lesson 47',
      title: 'INNER JOIN - Matching Records from Tables',
      description:
        'Learn how INNER JOIN returns only the records that have matching values in both tables.',

      content: {
        points: [
          'INNER JOIN is used to combine records from two or more tables.',
          'It returns only the records where matching values are found in both tables.',
          'The matching condition is usually specified using the ON clause.',
          'INNER JOIN is useful when we only want related records from both tables.',
          'Records without a matching value in either table are not included in the result.',
          'INNER JOIN is one of the most commonly used SQL joins.',
        ],

        syntax:
          'SELECT table1.column1, table2.column2\nFROM table1\nINNER JOIN table2\nON table1.common_column = table2.common_column;',

        example:
          'SELECT customers.name, orders.order_id\nFROM customers\nINNER JOIN orders\nON customers.id = orders.customer_id;',

        explanation: [
          'The customers table contains customer information.',
          'The orders table contains order information.',
          'customers.id and orders.customer_id are used to match the records.',
          'INNER JOIN returns only customers who have a matching order.',
          'The ON condition tells SQL which columns should be compared.',
          'Customers without any matching order will not appear in the result.',
        ],
      },

      query:
        'SELECT customers.name, orders.order_id FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',

      hint: 'Use INNER JOIN between the two tables and match their related columns using ON.',

      difficulty: 'Medium',

      quiz: {
        question: 'What does an INNER JOIN return?',
        options: [
          'All records from the first table',
          'All records from both tables',
          'Only records with matching values in both tables',
          'Only records without matching values',
        ],
        correctAnswer: 2,
        explanation:
          'INNER JOIN returns only the records that have matching values in both tables.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display customer names and their order IDs using INNER JOIN.',
          query:
            'SELECT customers.name, orders.order_id FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Join customers and orders using customers.id and orders.customer_id.',
        },
        {
          id: 2,
          description: 'Display customer names and order status using INNER JOIN.',
          query:
            'SELECT customers.name, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use INNER JOIN and select name and status.',
        },
        {
          id: 3,
          description: 'Display customer emails and order dates using INNER JOIN.',
          query:
            'SELECT customers.email, orders.order_date FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Match customers.id with orders.customer_id.',
        },
        {
          id: 4,
          description: 'Display customer names and order dates using INNER JOIN.',
          query:
            'SELECT customers.name, orders.order_date FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use INNER JOIN between customers and orders.',
        },
        {
          id: 5,
          description: 'Display customer names and order statuses using INNER JOIN.',
          query:
            'SELECT customers.name, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Select name and status and match the customer IDs.',
        },
      ],
    },
    {
      id: 48,
      name: 'Lesson 48',
      title: 'LEFT JOIN - Including All Left Table Records',
      description:
        'Learn how LEFT JOIN returns all records from the left table and matching records from the right table.',

      content: {
        points: [
          'LEFT JOIN is used to combine records from two tables.',
          'It returns all records from the left table.',
          'It also returns matching records from the right table.',
          'If there is no matching record in the right table, NULL values are returned for the right table columns.',
          'LEFT JOIN is useful when we want to keep every record from the main or left table.',
          'The matching condition is usually specified using the ON clause.',
        ],

        syntax:
          'SELECT table1.column1, table2.column2\nFROM table1\nLEFT JOIN table2\nON table1.common_column = table2.common_column;',

        example:
          'SELECT customers.name, orders.order_id\nFROM customers\nLEFT JOIN orders\nON customers.id = orders.customer_id;',

        explanation: [
          'The customers table is the left table because it appears after FROM.',
          'The orders table is the right table because it appears after LEFT JOIN.',
          'LEFT JOIN returns every customer, even if the customer has no order.',
          'When a customer has a matching order, the order information is displayed.',
          'If a customer has no matching order, the order columns contain NULL.',
          'The ON condition tells SQL how the two tables are related.',
        ],
      },

      query:
        'SELECT customers.name, orders.order_id FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',

      hint: 'Use LEFT JOIN to keep all records from the table written after FROM.',

      difficulty: 'Medium',

      quiz: {
        question: 'What does a LEFT JOIN return?',
        options: [
          'Only matching records from both tables',
          'All records from the left table and matching records from the right table',
          'Only records from the right table',
          'Only records that do not match',
        ],
        correctAnswer: 1,
        explanation:
          'LEFT JOIN returns all records from the left table and matching records from the right table. If there is no match, NULL is returned for the right table columns.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display all customers and their order IDs using LEFT JOIN.',
          query:
            'SELECT customers.name, orders.order_id FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use LEFT JOIN between customers and orders.',
        },
        {
          id: 2,
          description: 'Display all customers and their order status using LEFT JOIN.',
          query:
            'SELECT customers.name, orders.status FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Keep all customers and match their orders.',
        },
        {
          id: 3,
          description: 'Display all customers and their order dates using LEFT JOIN.',
          query:
            'SELECT customers.name, orders.order_date FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use customers as the left table.',
        },
        {
          id: 4,
          description: 'Display all customers with their email and order IDs.',
          query:
            'SELECT customers.email, orders.order_id FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Select email from customers and order_id from orders.',
        },
        {
          id: 5,
          description: 'Display all customers along with their order status.',
          query:
            'SELECT customers.name, orders.status FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use LEFT JOIN and match customers.id with orders.customer_id.',
        },
      ],
    },
    {
      id: 49,
      name: 'Lesson 49',
      title: 'RIGHT JOIN - Including All Right Table Records',
      description:
        'Learn how RIGHT JOIN returns all records from the right table and matching records from the left table.',

      content: {
        points: [
          'RIGHT JOIN is used to combine records from two tables.',
          'It returns all records from the right table.',
          'It also returns matching records from the left table.',
          'If there is no matching record in the left table, NULL values are returned for the left table columns.',
          'RIGHT JOIN is useful when we want to keep every record from the right table.',
          'The matching condition is usually specified using the ON clause.',
          'RIGHT JOIN is the opposite of LEFT JOIN in terms of which table is fully preserved.',
        ],

        syntax:
          'SELECT table1.column1, table2.column2\nFROM table1\nRIGHT JOIN table2\nON table1.common_column = table2.common_column;',

        example:
          'SELECT customers.name, orders.order_id\nFROM customers\nRIGHT JOIN orders\nON customers.id = orders.customer_id;',

        explanation: [
          'The customers table is the left table because it appears after FROM.',
          'The orders table is the right table because it appears after RIGHT JOIN.',
          'RIGHT JOIN returns every order, even if there is no matching customer record.',
          'When an order has a matching customer, the customer information is displayed.',
          'If an order has no matching customer, the customer columns contain NULL.',
          'The ON condition tells SQL how the two tables are related.',
          'RIGHT JOIN is useful when all records from the right table must be included.',
        ],
      },

      query:
        'SELECT customers.name, orders.order_id FROM customers RIGHT JOIN orders ON customers.id = orders.customer_id;',

      hint: 'Use RIGHT JOIN to keep all records from the table written after RIGHT JOIN.',

      difficulty: 'Medium',

      quiz: {
        question: 'What does a RIGHT JOIN return?',
        options: [
          'Only matching records from both tables',
          'All records from the left table',
          'All records from the right table and matching records from the left table',
          'Only records that do not match',
        ],
        correctAnswer: 2,
        explanation:
          'RIGHT JOIN returns all records from the right table and matching records from the left table. If there is no match, NULL is returned for the left table columns.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display all orders and their customer names using RIGHT JOIN.',
          query:
            'SELECT customers.name, orders.order_id FROM customers RIGHT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use RIGHT JOIN between customers and orders.',
        },
        {
          id: 2,
          description: 'Display all orders and their status along with customer names.',
          query:
            'SELECT customers.name, orders.status FROM customers RIGHT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Keep all orders and match customer information.',
        },
        {
          id: 3,
          description: 'Display all orders and their order dates along with customer names.',
          query:
            'SELECT customers.name, orders.order_date FROM customers RIGHT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use orders as the right table.',
        },
        {
          id: 4,
          description: 'Display all orders with their customer emails.',
          query:
            'SELECT customers.email, orders.order_id FROM customers RIGHT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Select email from customers and order_id from orders.',
        },
        {
          id: 5,
          description: 'Display all orders along with their customer names and status.',
          query:
            'SELECT customers.name, orders.status FROM customers RIGHT JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use RIGHT JOIN and match customers.id with orders.customer_id.',
        },
      ],
    },
    {
      id: 50,
      name: 'Lesson 50',
      title: 'FULL OUTER JOIN - Combining All Records from Both Tables',
      description:
        'Learn how FULL OUTER JOIN returns all records from both tables, including matching and non-matching records.',

      content: {
        points: [
          'FULL OUTER JOIN is used to combine records from two tables.',
          'It returns all records from both tables.',
          'Matching records are combined into one row.',
          'If there is no matching record, NULL values are shown for the missing side.',
          'FULL OUTER JOIN is useful when we want both matched and unmatched records from both tables.',
        ],

        syntax:
          'SELECT table1.column1, table2.column2\nFROM table1\nFULL OUTER JOIN table2\nON table1.common_column = table2.common_column;',

        example:
          'SELECT customers.name, orders.id\nFROM customers\nFULL OUTER JOIN orders\nON customers.id = orders.customer_id;',

        explanation: [
          'The customers table contains customer information.',
          'The orders table contains order information.',
          'customers.id and orders.customer_id are used to match the records.',
          'FULL OUTER JOIN returns customers who have matching orders.',
          'It also includes customers who do not have any matching order.',
          'It also includes orders that do not have a matching customer.',
          'NULL values appear when there is no matching record on one side.',
        ],
      },

      query:
        'SELECT customers.name, orders.id FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id;',

      hint: 'Use FULL OUTER JOIN between customers and orders and match customers.id with orders.customer_id.',

      difficulty: 'Hard',

      quiz: {
        question: 'What does a FULL OUTER JOIN return?',
        options: [
          'Only matching records',
          'All records from the left table',
          'All records from both tables',
          'Only records from the right table',
        ],
        correctAnswer: 2,
        explanation:
          'FULL OUTER JOIN returns all records from both tables, including matching and non-matching records.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display customer names and order IDs using FULL OUTER JOIN.',
          query:
            'SELECT customers.name, orders.id FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Join customers and orders using customers.id and orders.customer_id.',
        },
        {
          id: 2,
          description: 'Display customer names and order status using FULL OUTER JOIN.',
          query:
            'SELECT customers.name, orders.status FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use FULL OUTER JOIN and select name and status.',
        },
        {
          id: 3,
          description: 'Display customer emails and order dates using FULL OUTER JOIN.',
          query:
            'SELECT customers.email, orders.order_date FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Match customers.id with orders.customer_id.',
        },
        {
          id: 4,
          description: 'Display customer names and order dates using FULL OUTER JOIN.',
          query:
            'SELECT customers.name, orders.order_date FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Use FULL OUTER JOIN between customers and orders.',
        },
        {
          id: 5,
          description: 'Display customer names and order statuses using FULL OUTER JOIN.',
          query:
            'SELECT customers.name, orders.status FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id;',
          hint: 'Select name and status and match the customer IDs.',
        },
      ],
    },
    {
      id: 51,
      name: 'Lesson 51',
      title: 'CROSS JOIN - Combining Every Row from Both Tables',
      description:
        'Learn how CROSS JOIN combines every row from one table with every row from another table.',

      content: {
        points: [
          'CROSS JOIN combines every row of the first table with every row of the second table.',
          'It produces all possible combinations of rows.',
          'CROSS JOIN does not require an ON condition.',
          'The number of rows in the result is the number of rows in the first table multiplied by the number of rows in the second table.',
        ],

        syntax: 'SELECT columns\nFROM table1\nCROSS JOIN table2;',

        example: 'SELECT customers.name, products.name\nFROM customers\nCROSS JOIN products;',

        explanation: [
          'The customers table is combined with the products table.',
          'Every customer is paired with every product.',
          'No matching condition is required.',
          'If there are 5 customers and 5 products, the result can contain 25 combinations.',
          'CROSS JOIN is useful when all possible combinations are required.',
        ],
      },

      query: 'SELECT customers.name, products.name FROM customers CROSS JOIN products;',

      hint: 'Use CROSS JOIN between customers and products. No ON condition is needed.',

      difficulty: 'Hard',

      quiz: {
        question: 'What does CROSS JOIN produce?',
        options: [
          'Only matching records',
          'Only unmatched records',
          'All possible combinations of rows',
          'Only records from the first table',
        ],
        correctAnswer: 2,
        explanation: 'CROSS JOIN produces every possible combination of rows from the two tables.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display every possible combination of customers and products.',
          query: 'SELECT customers.name, products.name FROM customers CROSS JOIN products;',
          hint: 'Use CROSS JOIN between customers and products.',
        },
        {
          id: 2,
          description: 'Combine every customer with every product.',
          query: 'SELECT customers.name, products.name FROM customers CROSS JOIN products;',
          hint: 'CROSS JOIN does not need an ON condition.',
        },
        {
          id: 3,
          description: 'Show all possible customer-product combinations.',
          query: 'SELECT customers.name, products.name FROM customers CROSS JOIN products;',
          hint: 'Use CROSS JOIN to create all combinations.',
        },
        {
          id: 4,
          description: 'Display customer names with every product name.',
          query: 'SELECT customers.name, products.name FROM customers CROSS JOIN products;',
          hint: 'Combine customers and products using CROSS JOIN.',
        },
        {
          id: 5,
          description: 'Generate all possible combinations between customers and products.',
          query: 'SELECT customers.name, products.name FROM customers CROSS JOIN products;',
          hint: 'Use CROSS JOIN without an ON condition.',
        },
      ],
    },
    {
      id: 52,
      name: 'Lesson 52',
      title: 'SELF JOIN - Joining a Table with Itself',
      description:
        'Learn how SELF JOIN is used to compare or relate records within the same table.',

      content: {
        points: [
          'SELF JOIN is a join in which a table is joined with itself.',
          'It is useful when records in the same table are related to each other.',
          'SELF JOIN uses table aliases to treat the same table as two separate tables.',
          'The ON condition is used to specify how the records should be matched.',
          'SELF JOIN is commonly used for hierarchical data such as employees and their managers.',
        ],

        syntax:
          'SELECT a.column1, b.column2\nFROM table_name a\nINNER JOIN table_name b\nON a.common_column = b.common_column;',

        example:
          'SELECT e1.name AS Employee, e2.name AS Manager\nFROM employees e1\nINNER JOIN employees e2\nON e1.manager_id = e2.id;',

        explanation: [
          'The employees table is used twice in the query.',
          'The aliases e1 and e2 represent two different uses of the same table.',
          'e1 represents the employee and e2 represents the manager.',
          'The ON condition matches the employee manager_id with the manager id.',
          'SELF JOIN is useful for finding relationships between records in the same table.',
        ],
      },

      query:
        'SELECT e1.name AS Employee, e2.name AS Manager FROM employees e1 INNER JOIN employees e2 ON e1.manager_id = e2.id;',

      hint: 'Use the employees table twice with different aliases and match manager_id with id.',

      difficulty: 'Hard',

      quiz: {
        question: 'What is a SELF JOIN?',
        options: [
          'A join between two different databases',
          'A join of a table with itself',
          'A join that returns only NULL values',
          'A join that does not use aliases',
        ],
        correctAnswer: 1,
        explanation: 'SELF JOIN joins a table with itself, usually using different aliases.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display employees and their managers using SELF JOIN.',
          query:
            'SELECT e1.name AS Employee, e2.name AS Manager FROM employees e1 INNER JOIN employees e2 ON e1.manager_id = e2.id;',
          hint: 'Use the employees table twice with aliases.',
        },
        {
          id: 2,
          description: 'Display employee names and manager names using SELF JOIN.',
          query:
            'SELECT e1.name AS Employee, e2.name AS Manager FROM employees e1 INNER JOIN employees e2 ON e1.manager_id = e2.id;',
          hint: 'Match manager_id of one employee with id of another employee.',
        },
        {
          id: 3,
          description: 'Find the relationship between employees and their managers.',
          query:
            'SELECT e1.name AS Employee, e2.name AS Manager FROM employees e1 INNER JOIN employees e2 ON e1.manager_id = e2.id;',
          hint: 'Use two aliases for the employees table.',
        },
        {
          id: 4,
          description: 'Display each employee along with their manager.',
          query:
            'SELECT e1.name AS Employee, e2.name AS Manager FROM employees e1 INNER JOIN employees e2 ON e1.manager_id = e2.id;',
          hint: 'Use SELF JOIN and match manager_id with id.',
        },
        {
          id: 5,
          description: 'Use SELF JOIN to display employee and manager names.',
          query:
            'SELECT e1.name AS Employee, e2.name AS Manager FROM employees e1 INNER JOIN employees e2 ON e1.manager_id = e2.id;',
          hint: 'Join employees with itself using aliases e1 and e2.',
        },
      ],
    },

    {
      id: 53,
      name: 'Lesson 53',
      title: 'Multiple Table Joins - Joining More Than Two Tables',
      description:
        'Learn how to combine data from three or more tables using multiple JOIN clauses.',

      content: {
        points: [
          'Multiple Table Joins are used to combine data from three or more tables.',
          'More than one JOIN clause can be used in a single SQL query.',
          'Each JOIN connects one table with another related table.',
          'The ON clause specifies the columns used to connect the tables.',
          'Multiple Table Joins are useful when required information is stored in different tables.',
          'They help retrieve related information from several tables in a single query.',
        ],

        syntax:
          'SELECT table1.column1, table2.column2, table3.column3\nFROM table1\nINNER JOIN table2\nON table1.common_column = table2.common_column\nINNER JOIN table3\nON table2.common_column = table3.common_column;',

        example:
          'SELECT customers.name, orders.id, orders.status\nFROM customers\nINNER JOIN orders\nON customers.id = orders.customer_id\nINNER JOIN products\nON orders.product_id = products.id;',

        explanation: [
          'The query combines three tables: customers, orders, and products.',
          'The customers table is first joined with the orders table.',
          'The customers.id and orders.customer_id columns are used to connect the first two tables.',
          'The orders table is then joined with the products table.',
          'Each ON condition specifies how the related tables should be connected.',
          'Multiple Table Joins allow information from several related tables to be displayed together.',
        ],
      },

      query:
        'SELECT customers.name, orders.id, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id INNER JOIN products ON orders.product_id = products.id;',

      hint: 'Use two INNER JOIN clauses to connect customers, orders, and products.',

      difficulty: 'Hard',

      quiz: {
        question: 'Why are Multiple Table Joins used?',
        options: [
          'To delete multiple tables',
          'To combine data from three or more related tables',
          'To create a new database',
          'To remove duplicate records',
        ],
        correctAnswer: 1,
        explanation:
          'Multiple Table Joins combine related data from three or more tables using multiple JOIN clauses.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Display customer names, order IDs, and order status using multiple table joins.',
          query:
            'SELECT customers.name, orders.id, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id INNER JOIN products ON orders.product_id = products.id;',
          hint: 'Use two INNER JOIN clauses to connect the three tables.',
        },
        {
          id: 2,
          description: 'Combine customers, orders, and products using multiple INNER JOINs.',
          query:
            'SELECT customers.name, orders.id, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id INNER JOIN products ON orders.product_id = products.id;',
          hint: 'Connect customers with orders and orders with products.',
        },
        {
          id: 3,
          description: 'Display information from customers, orders, and products together.',
          query:
            'SELECT customers.name, orders.id, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id INNER JOIN products ON orders.product_id = products.id;',
          hint: 'Use multiple JOIN clauses with the related columns.',
        },
        {
          id: 4,
          description:
            'Display customer names along with their order information using multiple table joins.',
          query:
            'SELECT customers.name, orders.id, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id INNER JOIN products ON orders.product_id = products.id;',
          hint: 'Join all three tables using their related ID columns.',
        },
        {
          id: 5,
          description: 'Retrieve related information from three tables using INNER JOIN.',
          query:
            'SELECT customers.name, orders.id, orders.status FROM customers INNER JOIN orders ON customers.id = orders.customer_id INNER JOIN products ON orders.product_id = products.id;',
          hint: 'Use two INNER JOIN clauses to connect the tables.',
        },
      ],
    },
    {
      id: 54,
      name: 'Lesson 54',
      title: 'What is a Subquery? - Query Inside Another Query',
      description: 'Learn what a subquery is and how a query can be used inside another SQL query.',

      content: {
        points: [
          'A subquery is a query written inside another SQL query.',
          'The inner query is called the subquery, and the outer query is called the main query.',
          'A subquery is usually written inside parentheses.',
          'The result of the subquery can be used by the main query.',
          'Subqueries are useful when the result of one query is needed to perform another query.',
          'Subqueries can be used with commands such as SELECT, WHERE, and other SQL clauses.',
        ],

        syntax:
          'SELECT columns\nFROM table_name\nWHERE column_name = (SELECT column_name\nFROM table_name\nWHERE condition);',

        example:
          'SELECT name, salary\nFROM employees\nWHERE salary = (SELECT MAX(salary)\nFROM employees);',

        explanation: [
          'The inner query finds the maximum salary from the employees table.',
          'The outer query finds the employee whose salary is equal to that maximum salary.',
          'The subquery is written inside parentheses.',
          'The result of the inner query is used by the outer query.',
          'This allows us to solve a problem using more than one query.',
        ],
      },

      query:
        'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',

      hint: 'Use a subquery inside WHERE to find the employee with the maximum salary.',

      difficulty: 'Hard',

      quiz: {
        question: 'What is a subquery?',
        options: [
          'A query written inside another query',
          'A command used to delete a database',
          'A command used to create a table',
          'A query that can only contain INSERT',
        ],
        correctAnswer: 0,
        explanation: 'A subquery is a query written inside another SQL query.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display the employee with the highest salary using a subquery.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use MAX(salary) inside a subquery.',
        },
        {
          id: 2,
          description: 'Find the employee whose salary is equal to the highest salary.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use a subquery with MAX().',
        },
        {
          id: 3,
          description: 'Use a subquery to find the employee with the maximum salary.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Place the MAX(salary) query inside the WHERE condition.',
        },
        {
          id: 4,
          description: 'Display the name and salary of the highest-paid employee using a subquery.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use SELECT name, salary and compare salary with a subquery.',
        },
        {
          id: 5,
          description: 'Find the highest-paid employee using a query inside another query.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use a subquery with MAX(salary).',
        },
      ],
    },
    {
      id: 55,
      name: 'Lesson 55',
      title: 'Single-row Subquery - Returning One Value',
      description: 'Learn how to use a subquery that returns only one row or one value.',

      content: {
        points: [
          'A single-row subquery returns only one row from the inner query.',
          'It is commonly used with comparison operators such as =, >, <, >=, and <=.',
          'The outer query uses the single value returned by the subquery.',
          'The subquery is usually written inside parentheses.',
          'Single-row subqueries are useful when comparing a value with one specific result.',
        ],

        syntax:
          'SELECT columns\nFROM table_name\nWHERE column_name = (SELECT column_name\nFROM table_name\nWHERE condition);',

        example:
          'SELECT name, salary\nFROM employees\nWHERE salary = (SELECT MAX(salary)\nFROM employees);',

        explanation: [
          'The inner query finds the maximum salary from the employees table.',
          'The subquery returns one value: the highest salary.',
          'The outer query compares each employee salary with that value.',
          'The employee whose salary matches the maximum salary is returned.',
          'Since the subquery returns one value, it can be used with the = operator.',
        ],
      },

      query:
        'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',

      hint: 'Use a subquery with MAX(salary) that returns one value and compare it using =.',

      difficulty: 'Hard',

      quiz: {
        question: 'What does a single-row subquery return?',
        options: [
          'Multiple tables',
          'Only one row or one value',
          'All rows from the database',
          'Only column names',
        ],
        correctAnswer: 1,
        explanation:
          'A single-row subquery returns one row or one value that can be used by the outer query.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Display the employee with the highest salary using a single-row subquery.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use MAX(salary) in a subquery and compare salary using =.',
        },
        {
          id: 2,
          description: 'Find the employee whose salary equals the maximum salary.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use a single-row subquery with MAX().',
        },
        {
          id: 3,
          description: 'Display the name and salary of the highest-paid employee.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'The inner query should return the highest salary.',
        },
        {
          id: 4,
          description: 'Use a single-row subquery to find the highest-paid employee.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use = with the result of the subquery.',
        },
        {
          id: 5,
          description: 'Find the employee whose salary matches the maximum salary.',
          query:
            'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);',
          hint: 'Use MAX(salary) inside the subquery.',
        },
      ],
    },
    {
      id: 56,
      name: 'Lesson 56',
      title: 'Multiple-row Subquery - Returning Multiple Values',
      description: 'Learn how to use a subquery that returns multiple rows or values.',

      content: {
        points: [
          'A multiple-row subquery returns more than one row from the inner query.',
          'It is commonly used with operators such as IN, ANY, and ALL.',
          'The outer query uses the values returned by the subquery.',
          'A multiple-row subquery is useful when the result contains several possible values.',
          'The subquery is usually written inside parentheses.',
        ],

        syntax:
          'SELECT columns\nFROM table_name\nWHERE column_name IN (SELECT column_name\nFROM table_name\nWHERE condition);',

        example:
          'SELECT name, salary\nFROM employees\nWHERE department IN (SELECT department\nFROM employees\nWHERE salary > 50000);',

        explanation: [
          'The inner query finds the departments of employees whose salary is greater than 50000.',
          'The subquery can return multiple department values.',
          'The outer query finds employees whose department matches any department returned by the subquery.',
          'The IN operator is useful when the subquery returns multiple values.',
          'This allows the outer query to work with a list of values returned by the inner query.',
        ],
      },

      query:
        'SELECT name, salary FROM employees WHERE department IN (SELECT department FROM employees WHERE salary > 50000);',

      hint: 'Use IN with a subquery that returns multiple department values.',

      difficulty: 'Hard',

      quiz: {
        question: 'Which operator is commonly used with a multiple-row subquery?',
        options: ['IN', 'CREATE', 'DROP', 'ALTER'],
        correctAnswer: 0,
        explanation:
          'IN is commonly used with a multiple-row subquery because it can compare a value with multiple values returned by the subquery.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Display employees who belong to departments where an employee earns more than 50000.',
          query:
            'SELECT name, salary FROM employees WHERE department IN (SELECT department FROM employees WHERE salary > 50000);',
          hint: 'Use IN with a subquery that finds departments of employees earning more than 50000.',
        },
        {
          id: 2,
          description:
            'Find employees whose department is included in the departments returned by the subquery.',
          query:
            'SELECT name, salary FROM employees WHERE department IN (SELECT department FROM employees WHERE salary > 50000);',
          hint: 'Use department IN with a subquery.',
        },
        {
          id: 3,
          description: 'Use a multiple-row subquery to find employees from selected departments.',
          query:
            'SELECT name, salary FROM employees WHERE department IN (SELECT department FROM employees WHERE salary > 50000);',
          hint: 'The inner query should return department values.',
        },
        {
          id: 4,
          description: 'Display employee names and salaries using a multiple-row subquery.',
          query:
            'SELECT name, salary FROM employees WHERE department IN (SELECT department FROM employees WHERE salary > 50000);',
          hint: 'Use IN to compare department with multiple returned values.',
        },
        {
          id: 5,
          description: 'Find employees whose departments have employees earning more than 50000.',
          query:
            'SELECT name, salary FROM employees WHERE department IN (SELECT department FROM employees WHERE salary > 50000);',
          hint: 'Use a subquery with department and salary > 50000.',
        },
      ],
    },
    {
      id: 57,
      name: 'Lesson 57',
      title: 'UNION - Combining Results of Multiple Queries',
      description:
        'Learn how UNION combines the results of two or more SELECT queries into a single result.',

      content: {
        points: [
          'UNION is used to combine the results of two or more SELECT queries.',
          'It removes duplicate rows from the final result.',
          'The SELECT queries used with UNION should have the same number of columns.',
          'The corresponding columns should have compatible data types.',
          'UNION is useful when we want to combine similar data from different queries.',
        ],

        syntax:
          'SELECT column1, column2\nFROM table1\nUNION\nSELECT column1, column2\nFROM table2;',

        example: 'SELECT name, email\nFROM customers\nUNION\nSELECT name, email\nFROM users;',

        explanation: [
          'The first SELECT query retrieves name and email from the customers table.',
          'The second SELECT query retrieves name and email from the users table.',
          'UNION combines the results of both SELECT queries.',
          'Duplicate rows are removed from the final result.',
          'Both queries contain the same number of columns with compatible data types.',
        ],
      },

      query: 'SELECT name, email FROM customers UNION SELECT name, email FROM users;',

      hint: 'Use two SELECT statements with the same number of columns and connect them using UNION.',

      difficulty: 'Hard',

      quiz: {
        question: 'What does UNION do in SQL?',
        options: [
          'Deletes duplicate tables',
          'Combines results of multiple SELECT queries',
          'Creates a new database',
          'Updates records in a table',
        ],
        correctAnswer: 1,
        explanation:
          'UNION combines the results of two or more SELECT queries and removes duplicate rows.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Combine names and emails from customers and users using UNION.',
          query: 'SELECT name, email FROM customers UNION SELECT name, email FROM users;',
          hint: 'Use two SELECT queries with the same columns and connect them using UNION.',
        },
        {
          id: 2,
          description: 'Combine the results of customers and users into one result.',
          query: 'SELECT name, email FROM customers UNION SELECT name, email FROM users;',
          hint: 'Use UNION between the two SELECT statements.',
        },
        {
          id: 3,
          description: 'Display unique names and emails from both tables using UNION.',
          query: 'SELECT name, email FROM customers UNION SELECT name, email FROM users;',
          hint: 'UNION automatically removes duplicate rows.',
        },
        {
          id: 4,
          description: 'Combine customer and user information using two SELECT queries.',
          query: 'SELECT name, email FROM customers UNION SELECT name, email FROM users;',
          hint: 'Both SELECT queries should have the same number of columns.',
        },
        {
          id: 5,
          description: 'Use UNION to combine name and email records from two tables.',
          query: 'SELECT name, email FROM customers UNION SELECT name, email FROM users;',
          hint: 'Write two SELECT statements and place UNION between them.',
        },
      ],
    },
    {
      id: 58,
      name: 'Lesson 58',
      title: 'Views - Creating Virtual Tables',
      description:
        'Learn how SQL Views are used to store a query as a virtual table for easier data access.',

      content: {
        points: [
          'A View is a virtual table created from the result of a SQL query.',
          'A View does not usually store the actual data separately; it displays data from one or more existing tables.',
          'Views can simplify complex SQL queries.',
          'A View can be used like a table in SELECT queries.',
          'Views are useful for improving data organization and controlling access to specific data.',
          'A View is created using the CREATE VIEW statement.',
        ],

        syntax:
          'CREATE VIEW view_name AS\nSELECT column1, column2\nFROM table_name\nWHERE condition;',

        example:
          'CREATE VIEW active_customers AS\nSELECT id, name, email\nFROM customers\nWHERE is_active = 1;',

        explanation: [
          'The CREATE VIEW statement creates a new View named active_customers.',
          'The View selects id, name, and email from the customers table.',
          'Only customers whose is_active value is 1 are included.',
          'The View can later be queried like a table.',
          'For example, SELECT * FROM active_customers; can be used to view the data.',
        ],
      },

      query:
        'CREATE VIEW active_customers AS SELECT id, name, email FROM customers WHERE is_active = 1;',

      hint: 'Use CREATE VIEW followed by the View name and place the SELECT query after AS.',

      difficulty: 'Hard',

      quiz: {
        question: 'What is a View in SQL?',
        options: [
          'A physical copy of a database',
          'A virtual table based on a SQL query',
          'A command used to delete a table',
          'A type of database constraint',
        ],
        correctAnswer: 1,
        explanation: 'A View is a virtual table created from the result of a SQL query.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a View named active_customers containing active customer records.',
          query:
            'CREATE VIEW active_customers AS SELECT id, name, email FROM customers WHERE is_active = 1;',
          hint: 'Use CREATE VIEW with the customers table and filter active customers.',
        },
        {
          id: 2,
          description: 'Create a View that displays id, name, and email of active customers.',
          query:
            'CREATE VIEW active_customers AS SELECT id, name, email FROM customers WHERE is_active = 1;',
          hint: 'Use CREATE VIEW and SELECT the required columns.',
        },
        {
          id: 3,
          description: 'Create a virtual table containing active customers.',
          query:
            'CREATE VIEW active_customers AS SELECT id, name, email FROM customers WHERE is_active = 1;',
          hint: 'Create the View using the CREATE VIEW statement.',
        },
        {
          id: 4,
          description: 'Create a View named active_customers using the customers table.',
          query:
            'CREATE VIEW active_customers AS SELECT id, name, email FROM customers WHERE is_active = 1;',
          hint: 'Use AS before the SELECT query.',
        },
        {
          id: 5,
          description: 'Create a View to show only active customer information.',
          query:
            'CREATE VIEW active_customers AS SELECT id, name, email FROM customers WHERE is_active = 1;',
          hint: 'Filter customers using is_active = 1.',
        },
      ],
    },
    {
      id: 59,
      name: 'Lesson 59',
      title: 'Sequences - Generating Sequential Numbers',
      description:
        'Learn how SQL Sequences are used to generate a series of unique numbers automatically.',

      content: {
        points: [
          'A Sequence is a database object used to generate a series of numbers automatically.',
          'Sequences are commonly used to generate unique values for columns such as IDs.',
          'A Sequence can generate numbers in ascending or descending order.',
          'The NEXTVAL keyword is used to generate the next value from a Sequence.',
          'Sequences help avoid manually entering unique numbers.',
          'Sequences are commonly used in databases such as Oracle and PostgreSQL.',
        ],

        syntax:
          'CREATE SEQUENCE sequence_name\nSTART WITH starting_value\nINCREMENT BY increment_value;',

        example: 'CREATE SEQUENCE customer_seq\nSTART WITH 1\nINCREMENT BY 1;',

        explanation: [
          'The CREATE SEQUENCE statement creates a Sequence named customer_seq.',
          'START WITH 1 means the Sequence starts generating numbers from 1.',
          'INCREMENT BY 1 means each new value increases by 1.',
          'The next value can be obtained using customer_seq.NEXTVAL in supported databases.',
          'Sequences are useful for automatically generating unique numeric values.',
        ],
      },

      query: 'CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;',

      hint: 'Use CREATE SEQUENCE followed by the sequence name, START WITH, and INCREMENT BY.',

      difficulty: 'Hard',

      quiz: {
        question: 'What is the main purpose of a Sequence?',
        options: [
          'To delete records',
          'To generate a series of numbers automatically',
          'To combine two tables',
          'To remove duplicate records',
        ],
        correctAnswer: 1,
        explanation:
          'A Sequence is used to generate a series of numbers automatically, often for unique IDs.',
      },

      practiceQuestions: [
        {
          id: 1,
          description: 'Create a Sequence named customer_seq starting from 1 and increasing by 1.',
          query: 'CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;',
          hint: 'Use CREATE SEQUENCE with START WITH 1 and INCREMENT BY 1.',
        },
        {
          id: 2,
          description: 'Create a Sequence for generating customer IDs.',
          query: 'CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;',
          hint: 'Name the Sequence customer_seq.',
        },
        {
          id: 3,
          description: 'Create a Sequence that starts at 1 and increments by 1.',
          query: 'CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;',
          hint: 'Use START WITH and INCREMENT BY.',
        },
        {
          id: 4,
          description: 'Create a Sequence named customer_seq.',
          query: 'CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;',
          hint: 'Use the CREATE SEQUENCE command.',
        },
        {
          id: 5,
          description: 'Generate sequential numbers for customer IDs using a Sequence.',
          query: 'CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;',
          hint: 'Create customer_seq with starting value 1 and increment 1.',
        },
      ],
    },
    {
      id: 60,
      name: 'Lesson 60',
      title: 'Triggers - Automatically Executing Actions',
      description:
        'Learn how SQL Triggers automatically execute an action when a specified database event occurs.',

      content: {
        points: [
          'A Trigger is a database object that automatically executes when a specified event occurs.',
          'Triggers can execute automatically when INSERT, UPDATE, or DELETE operations occur.',
          'A Trigger is associated with a specific table or database event.',
          'Triggers are useful for maintaining data consistency and automatically performing related actions.',
          'A Trigger can execute before or after a database operation depending on the database system.',
          'Triggers are commonly used for auditing, validation, and automatic data updates.',
        ],

        syntax:
          'CREATE TRIGGER trigger_name\nBEFORE | AFTER INSERT | UPDATE | DELETE\nON table_name\nFOR EACH ROW\ntrigger_action;',

        example:
          'CREATE TRIGGER check_salary\nBEFORE INSERT ON employees\nFOR EACH ROW\ntrigger_action;',

        explanation: [
          'The CREATE TRIGGER statement creates a new Trigger.',
          'check_salary is the name of the Trigger.',
          'BEFORE INSERT means the Trigger runs before a new employee record is inserted.',
          'The Trigger is associated with the employees table.',
          'FOR EACH ROW means the Trigger can execute for each affected row.',
          'Triggers can be used to automatically perform actions when database events occur.',
        ],
      },

      query: 'CREATE TRIGGER check_salary BEFORE INSERT ON employees FOR EACH ROW trigger_action;',

      hint: 'Use CREATE TRIGGER followed by the trigger name and specify when and on which table it should execute.',

      difficulty: 'Hard',

      quiz: {
        question: 'What is the main purpose of a SQL Trigger?',
        options: [
          'To automatically execute an action when a specified database event occurs',
          'To manually display all records from a table',
          'To create a new database',
          'To permanently remove a database table',
        ],
        correctAnswer: 0,
        explanation:
          'A Trigger automatically executes an action when a specified database event such as INSERT, UPDATE, or DELETE occurs.',
      },

      practiceQuestions: [
        {
          id: 1,
          description:
            'Create a Trigger named check_salary that runs before inserting a record into employees.',
          query:
            'CREATE TRIGGER check_salary BEFORE INSERT ON employees FOR EACH ROW trigger_action;',
          hint: 'Use CREATE TRIGGER with BEFORE INSERT and the employees table.',
        },
        {
          id: 2,
          description: 'Create a Trigger that runs before an INSERT operation on employees.',
          query:
            'CREATE TRIGGER check_salary BEFORE INSERT ON employees FOR EACH ROW trigger_action;',
          hint: 'Specify BEFORE INSERT after the Trigger name.',
        },
        {
          id: 3,
          description: 'Create a Trigger named check_salary for the employees table.',
          query:
            'CREATE TRIGGER check_salary BEFORE INSERT ON employees FOR EACH ROW trigger_action;',
          hint: 'Use CREATE TRIGGER and associate it with employees.',
        },
        {
          id: 4,
          description:
            'Create a Trigger that executes for each row before inserting employee data.',
          query:
            'CREATE TRIGGER check_salary BEFORE INSERT ON employees FOR EACH ROW trigger_action;',
          hint: 'Use FOR EACH ROW after specifying the table.',
        },
        {
          id: 5,
          description:
            'Create a Trigger named check_salary that executes before employee records are inserted.',
          query:
            'CREATE TRIGGER check_salary BEFORE INSERT ON employees FOR EACH ROW trigger_action;',
          hint: 'Use BEFORE INSERT ON employees in the Trigger definition.',
        },
      ],
    },
  ];

  private normalizeSql(value: string): string {
    return value.replace(/;\s*$/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  private matchesLessonAnswer(query: string, expected: string): boolean {
    const normalizedQuery = this.normalizeSql(query);
    const normalizedExpected = this.normalizeSql(expected);

    if (normalizedQuery === normalizedExpected) {
      return true;
    }

    const queryNoParens = normalizedQuery.replace(/[()]/g, '');
    const expectedNoParens = normalizedExpected.replace(/[()]/g, '');

    return queryNoParens === expectedNoParens;
  }

  get currentLesson(): Lesson {
    return this.lessons[this.currentLessonIndex];
  }

  switchTab(tab: TabType): void {
    this.activeTab = tab;
    if (tab === 'home') {
      this.resetTask();
    }
  }

  useHint(): void {
    this.userXP = Math.max(0, this.userXP - 20);
    this.queryFeedbackMessage = `Hint: ${this.currentLesson.hint}`;
    this.feedbackMessage = this.queryFeedbackMessage;
    this.taskCompleted = false;
  }

  async checkQuery(): Promise<void> {
    const query = this.sqlInput.trim();
    if (!query) {
      this.queryFeedbackMessage = 'Please enter a SQL query before running it.';
      this.feedbackMessage = this.queryFeedbackMessage;
      this.taskCompleted = false;
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Query failed');
      }

      const rows = data.rows ?? [];
      const output = rows.length
        ? rows
            .slice(0, 10)
            .map((row: Record<string, unknown>) => Object.values(row).join(' | '))
            .join('\n')
        : 'Query executed successfully. No rows returned.';

      this.executionSummary = output;

      if (this.matchesLessonAnswer(query, this.currentPracticeQuestion.query)) {
        this.feedbackMessage = 'Correct! Practice query is right.';
        this.taskCompleted = true;
        this.incrementXP(50);
        this.updateProgress(true);
        return;
      }

      this.feedbackMessage =
        'Query executed successfully, but it does not match the exercise answer yet.';
      this.taskCompleted = false;
    } catch (error: any) {
      this.feedbackMessage = `SQL error: ${error?.message ?? 'Invalid query'}`;
      this.executionSummary = 'Query failed to execute.';
      this.taskCompleted = false;
    }
  }

  selectQuizAnswer(optionIndex: number): void {
    this.selectedQuizAnswer = optionIndex;
  }

  get currentPracticeQuestion(): PracticeQuestion {
    return this.currentLesson.practiceQuestions[this.selectedPracticeQuestionIndex];
  }

  selectPracticeQuestion(index: number): void {
    this.selectedPracticeQuestionIndex = index;
    this.resetTask();
  }

  submitQuizAnswer(): void {
    if (this.selectedQuizAnswer === null) {
      this.quizFeedbackMessage = 'Please select an option.';
      return;
    }

    if (this.selectedQuizAnswer === this.currentLesson.quiz.correctAnswer) {
      this.quizFeedbackMessage = `Correct! ${this.currentLesson.quiz.explanation}`;
      this.quizAnswered = true;
      this.incrementXP(30);
      this.updateProgress(true);
    } else {
      this.quizFeedbackMessage = `Incorrect. ${this.currentLesson.quiz.explanation}`;
      this.quizAnswered = true;
    }
  }

  nextLesson(): void {
    if (this.currentLessonIndex < this.lessons.length - 1) {
      this.currentLessonIndex++;
      this.resetTask();
    }
  }

  previousLesson(): void {
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex--;
      this.resetTask();
    }
  }

  resetTask(): void {
    this.sqlInput = '';
    this.queryFeedbackMessage = '';
    this.quizFeedbackMessage = '';
    this.feedbackMessage = '';
    this.taskCompleted = false;
    this.showNotes = false;
    this.selectedQuizAnswer = null;
    this.quizAnswered = false;
    this.executionSummary = 'Backend ready. Run a query to begin.';
  }

  toggleNotes(): void {
    this.showNotes = !this.showNotes;
  }

  incrementXP(amount: number): void {
    this.userXP += amount;
  }

  updateProgress(success: boolean): void {
    fetch(`${this.apiBaseUrl}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'demoUser',
        exerciseId: this.currentLesson.id,
        completed: success,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Progress saved:', data);
      })
      .catch((error) => {
        console.error('Error saving progress:', error);
      });
  }

  toggleSchema(): void {
    this.showSchema = !this.showSchema;
  }

  selectTable(index: number): void {
    this.selectedTableIndex = index;
  }

  get currentTable(): TableSchema {
    return this.tables[this.selectedTableIndex];
  }
}
