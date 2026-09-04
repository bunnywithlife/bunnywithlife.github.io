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

type TabType = 'home' | 'lessons';

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

  activeTab: TabType = 'home';
  sqlInput: string = '';
  feedbackMessage: string = '';
  taskCompleted: boolean = false;
  showNotes: boolean = false;
  showSchema: boolean = false;
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
    'The * symbol is used when we want to retrieve all columns from a table.'
  ],

  syntax: 'SELECT column1, column2 FROM table_name;',

  example: 'SELECT * FROM users;',

  explanation: [
    'SELECT tells SQL that we want to retrieve data.',
    '* means all columns of the table.',
    'FROM tells SQL which table we want to retrieve the data from.',
    'users is the name of the table from which the data is retrieved.'
  ]
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
    'It helps us find specific records instead of displaying all records.'
  ],

  syntax: 'SELECT column1, column2 FROM table_name WHERE condition;',

  example: 'SELECT * FROM users WHERE age > 25;',

  explanation: [
    'SELECT * means we want to retrieve all columns.',
    'FROM users tells SQL to retrieve the data from the users table.',
    'WHERE age > 25 filters the records and displays only users whose age is greater than 25.',
    'The condition after WHERE determines which records will be displayed.'
  ]
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
    'The column names should be separated using commas.'
  ],

  syntax: 'SELECT column1, column2 FROM table_name;',

  example: 'SELECT name, email FROM users;',

  explanation: [
    'SELECT tells SQL that we want to retrieve data.',
    'name and email are the specific columns we want to display.',
    'The comma separates the two column names.',
    'FROM users tells SQL to retrieve the information from the users table.',
    'The result will contain only the name and email columns instead of all columns.'
  ]
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
    'ORDER BY can be used with numbers, text, dates, and other sortable values.'
  ],

  syntax: 'SELECT column1, column2 FROM table_name ORDER BY column_name ASC;',

  example: 'SELECT * FROM users ORDER BY age ASC;',

  explanation: [
    'SELECT * means that we want to retrieve all columns.',
    'FROM users tells SQL to retrieve the records from the users table.',
    'ORDER BY age tells SQL to sort the records according to the age column.',
    'ASC means the ages will be arranged from smallest to largest.',
    'For descending order, we can use DESC instead of ASC.'
  ]
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
    'Aggregate functions perform calculations on a group of rows and return a single result.'
  ],

  syntax: 'SELECT COUNT(*) FROM table_name;',

  example: 'SELECT COUNT(*) FROM users;',

  explanation: [
    'SELECT tells SQL that we want to retrieve a result.',
    'COUNT(*) counts all the rows in the table.',
    'FROM users tells SQL to count the records from the users table.',
    'The result is a single number representing the total number of records in the users table.',
    'For example, if the users table contains 5 records, COUNT(*) will return 5.'
  ]
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
    'Text values are generally written inside single quotes, while numeric values are written without quotes.'
  ],

  syntax: 'INSERT INTO table_name (column1, column2, column3)\nVALUES (value1, value2, value3);',

  example: 'INSERT INTO users (name, email, age)\nVALUES (\'Rahul\', \'rahul@gmail.com\', 22);',

  explanation: [
    'INSERT INTO users tells SQL that we want to add a new record to the users table.',
    'name, email and age are the columns where we want to insert the data.',
    'VALUES provides the actual data for those columns.',
    '\'Rahul\' is inserted into the name column.',
    '\'rahul@gmail.com\' is inserted into the email column.',
    '22 is inserted into the age column.',
    'After a successful INSERT statement, a new row is added to the table.'
  ]
},

  query: 'INSERT INTO users (name, email, age) VALUES (\'Rahul\', \'rahul@gmail.com\', 22);',
  hint: 'Use INSERT INTO followed by the table name, column names, and VALUES.',
  difficulty: 'Easy',

  quiz: {
    question: 'Which SQL statement is used to add a new record to a table?',
    options: [
      'INSERT INTO',
      'ADD RECORD',
      'UPDATE',
      'CREATE'
    ],
    correctAnswer: 0,
    explanation: 'INSERT INTO is used to add new records to a table.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Insert a new user named Rahul with email rahul@gmail.com and age 22.',
      query: 'INSERT INTO users (name, email, age) VALUES (\'Rahul\', \'rahul@gmail.com\', 22);',
      hint: 'Use INSERT INTO users followed by the column names and VALUES.'
    },
    {
      id: 2,
      description: 'Insert a new user named Priya with email priya@gmail.com and age 21.',
      query: 'INSERT INTO users (name, email, age) VALUES (\'Priya\', \'priya@gmail.com\', 21);',
      hint: 'Specify name, email and age inside the INSERT statement.'
    },
    {
      id: 3,
      description: 'Insert a new user named Amit with email amit@gmail.com and age 25.',
      query: 'INSERT INTO users (name, email, age) VALUES (\'Amit\', \'amit@gmail.com\', 25);',
      hint: 'Use INSERT INTO users (name, email, age) and provide the values.'
    },
    {
      id: 4,
      description: 'Insert a new user named Neha with email neha@gmail.com and age 23.',
      query: 'INSERT INTO users (name, email, age) VALUES (\'Neha\', \'neha@gmail.com\', 23);',
      hint: 'Remember the order: name, email, age.'
    },
    {
      id: 5,
      description: 'Insert a new user named Karan with email karan@gmail.com and age 24.',
      query: 'INSERT INTO users (name, email, age) VALUES (\'Karan\', \'karan@gmail.com\', 24);',
      hint: 'Use INSERT INTO and VALUES to add the new record.'
    }
  ]
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
      'UPDATE is different from INSERT because UPDATE changes existing records, while INSERT adds a new record.'
    ],

    syntax: 'UPDATE table_name\nSET column_name = new_value\nWHERE condition;',

    example: 'UPDATE users\nSET age = 25\nWHERE name = \'Rahul\';',

    explanation: [
      'UPDATE users tells SQL that we want to modify data in the users table.',
      'SET age = 25 changes the age value to 25.',
      'WHERE name = \'Rahul\' identifies the user whose record should be updated.',
      'Only the record that satisfies the WHERE condition will be modified.',
      'The WHERE clause is very important because without it, all records may be updated.'
    ]
  },

  query: 'UPDATE users SET age = 25 WHERE name = \'Rahul\';',

  hint: 'Use UPDATE followed by the table name, SET to change the column value, and WHERE to select the record.',

  difficulty: 'Medium',

  quiz: {
    question: 'Which SQL keyword is used to specify the new value in an UPDATE statement?',
    options: [
      'VALUES',
      'SET',
      'CHANGE',
      'INSERT'
    ],
    correctAnswer: 1,
    explanation: 'SET is used to specify the new value of a column in an UPDATE statement.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Update Rahul\'s age to 25.',
      query: 'UPDATE users SET age = 25 WHERE name = \'Rahul\';',
      hint: 'Use UPDATE, SET and WHERE.'
    },
    {
      id: 2,
      description: 'Update Priya\'s age to 22.',
      query: 'UPDATE users SET age = 22 WHERE name = \'Priya\';',
      hint: 'Use the name in the WHERE condition.'
    },
    {
      id: 3,
      description: 'Update Amit\'s email to amit_new@gmail.com.',
      query: 'UPDATE users SET email = \'amit_new@gmail.com\' WHERE name = \'Amit\';',
      hint: 'Use SET to change the email and WHERE to identify Amit.'
    },
    {
      id: 4,
      description: 'Update Neha\'s age to 24.',
      query: 'UPDATE users SET age = 24 WHERE name = \'Neha\';',
      hint: 'Change the age using SET and identify Neha using WHERE.'
    },
    {
      id: 5,
      description: 'Update Karan\'s email to karan_new@gmail.com.',
      query: 'UPDATE users SET email = \'karan_new@gmail.com\' WHERE name = \'Karan\';',
      hint: 'Use UPDATE users SET email and add a WHERE condition for Karan.'
    }
  ]
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
      'DELETE is different from DROP because DELETE removes records, while DROP removes the entire table.'
    ],

    syntax: 'DELETE FROM table_name\nWHERE condition;',

    example: 'DELETE FROM users\nWHERE name = \'Rahul\';',

    explanation: [
      'DELETE FROM users tells SQL that we want to remove data from the users table.',
      'WHERE name = \'Rahul\' identifies the record that should be deleted.',
      'Only the record satisfying the condition will be removed.',
      'The users table itself will still exist after the DELETE operation.',
      'The WHERE clause is important because without it, all records may be deleted.'
    ]
  },

  query: 'DELETE FROM users WHERE name = \'Rahul\';',

  hint: 'Use DELETE FROM followed by the table name and use WHERE to identify the record you want to remove.',

  difficulty: 'Medium',

  quiz: {
    question: 'Which clause is used to specify which records should be deleted?',
    options: [
      'SET',
      'VALUES',
      'WHERE',
      'ORDER BY'
    ],
    correctAnswer: 2,
    explanation: 'The WHERE clause identifies the records that should be deleted.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Delete the user named Rahul.',
      query: 'DELETE FROM users WHERE name = \'Rahul\';',
      hint: 'Use DELETE FROM users and identify Rahul using WHERE.'
    },
    {
      id: 2,
      description: 'Delete the user named Priya.',
      query: 'DELETE FROM users WHERE name = \'Priya\';',
      hint: 'Use the name column in the WHERE condition.'
    },
    {
      id: 3,
      description: 'Delete the user named Amit.',
      query: 'DELETE FROM users WHERE name = \'Amit\';',
      hint: 'Use DELETE FROM users WHERE name = \'Amit\'.'
    },
    {
      id: 4,
      description: 'Delete the user named Neha.',
      query: 'DELETE FROM users WHERE name = \'Neha\';',
      hint: 'Use the WHERE clause to identify Neha.'
    },
    {
      id: 5,
      description: 'Delete the user named Karan.',
      query: 'DELETE FROM users WHERE name = \'Karan\';',
      hint: 'Use DELETE FROM users and add a WHERE condition for Karan.'
    }
  ]
},
{
  id: 9,
  name: 'Lesson 9',
  title: 'ALTER Statement - Modifying Table Structure',
  description: 'Learn how to modify the structure of an existing table using the ALTER statement.',

  content: {
    points: [
      'The ALTER statement is used to modify the structure of an existing table.',
      'It allows us to add, modify, or remove columns from a table.',
      'ALTER TABLE is commonly used when we need to change the design of a table.',
      'We can use ALTER TABLE to add a new column to an existing table.',
      'We can also remove an existing column using DROP COLUMN.',
      'ALTER changes the table structure, while UPDATE changes the data stored in the table.'
    ],

    syntax: 'ALTER TABLE table_name\nADD column_name datatype;',

    example: 'ALTER TABLE users\nADD phone VARCHAR(15);',

    explanation: [
      'ALTER TABLE users tells SQL that we want to change the structure of the users table.',
      'ADD is used to add a new column to the table.',
      'phone is the name of the new column.',
      'VARCHAR(15) specifies that the phone column can store text with a maximum length of 15 characters.',
      'After executing the statement, the users table will contain the new phone column.',
      'ALTER changes the structure of the table, not the existing records directly.'
    ]
  },

  query: 'ALTER TABLE users ADD phone VARCHAR(15);',

  hint: 'Use ALTER TABLE followed by the table name, ADD, the new column name and its datatype.',

  difficulty: 'Medium',

  quiz: {
    question: 'Which SQL statement is used to modify the structure of an existing table?',
    options: [
      'UPDATE',
      'ALTER TABLE',
      'INSERT INTO',
      'SELECT'
    ],
    correctAnswer: 1,
    explanation: 'ALTER TABLE is used to modify the structure of an existing table.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Add a phone column to the users table with VARCHAR(15) datatype.',
      query: 'ALTER TABLE users ADD phone VARCHAR(15);',
      hint: 'Use ALTER TABLE users ADD followed by the column name and datatype.'
    },
    {
      id: 2,
      description: 'Add an address column to the users table with VARCHAR(100) datatype.',
      query: 'ALTER TABLE users ADD address VARCHAR(100);',
      hint: 'Use ADD address VARCHAR(100).'
    },
    {
      id: 3,
      description: 'Add a city column to the users table with VARCHAR(50) datatype.',
      query: 'ALTER TABLE users ADD city VARCHAR(50);',
      hint: 'Use ALTER TABLE, ADD, city and VARCHAR(50).'
    },
    {
      id: 4,
      description: 'Add a phone column to the customers table with VARCHAR(15) datatype.',
      query: 'ALTER TABLE customers ADD phone VARCHAR(15);',
      hint: 'Change the table name to customers.'
    },
    {
      id: 5,
      description: 'Add a department column to the users table with VARCHAR(50) datatype.',
      query: 'ALTER TABLE users ADD department VARCHAR(50);',
      hint: 'Use ADD department VARCHAR(50).'
    }
  ]
},
{
  id: 10,
  name: 'Lesson 10',
  title: 'CREATE TABLE Statement - Creating a Table',
  description: 'Learn how to create a new table in a database using the CREATE TABLE statement.',

  content: {
    points: [
      'The CREATE TABLE statement is used to create a new table in a database.',
      'A table contains columns that define the type of data that can be stored.',
      'While creating a table, we specify the column names and their data types.',
      'Each column can have a different datatype such as INT, VARCHAR, DATE, etc.',
      'CREATE TABLE is a DDL statement because it changes the structure of the database.',
      'A table should have a meaningful name that describes the data it will store.'
    ],

    syntax: 'CREATE TABLE table_name (\n  column1 datatype,\n  column2 datatype,\n  column3 datatype\n);',

    example: 'CREATE TABLE students (\n  id INT,\n  name VARCHAR(50),\n  age INT\n);',

    explanation: [
      'CREATE TABLE students tells SQL that we want to create a new table named students.',
      'id INT creates an id column that stores integer values.',
      'name VARCHAR(50) creates a name column that can store text.',
      'age INT creates an age column that stores integer values.',
      'The brackets contain the columns and their datatypes.',
      'After successfully executing the statement, a new students table is created.'
    ]
  },

  query: 'CREATE TABLE students (id INT, name VARCHAR(50), age INT);',

  hint: 'Use CREATE TABLE followed by the table name and define each column with its datatype.',

  difficulty: 'Easy',

  quiz: {
    question: 'Which SQL statement is used to create a new table?',
    options: [
      'CREATE TABLE',
      'INSERT INTO',
      'ALTER TABLE',
      'UPDATE'
    ],
    correctAnswer: 0,
    explanation: 'CREATE TABLE is used to create a new table in a database.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Create a students table with id INT, name VARCHAR(50), and age INT.',
      query: 'CREATE TABLE students (id INT, name VARCHAR(50), age INT);',
      hint: 'Use CREATE TABLE students and define the three columns.'
    },
    {
      id: 2,
      description: 'Create a teachers table with id INT and name VARCHAR(50).',
      query: 'CREATE TABLE teachers (id INT, name VARCHAR(50));',
      hint: 'Use CREATE TABLE followed by the table name and column definitions.'
    },
    {
      id: 3,
      description: 'Create a courses table with id INT and course_name VARCHAR(100).',
      query: 'CREATE TABLE courses (id INT, course_name VARCHAR(100));',
      hint: 'Define id as INT and course_name as VARCHAR(100).'
    },
    {
      id: 4,
      description: 'Create a departments table with id INT and department_name VARCHAR(50).',
      query: 'CREATE TABLE departments (id INT, department_name VARCHAR(50));',
      hint: 'Use CREATE TABLE departments with the required columns.'
    },
    {
      id: 5,
      description: 'Create a books table with id INT, title VARCHAR(100), and price INT.',
      query: 'CREATE TABLE books (id INT, title VARCHAR(100), price INT);',
      hint: 'Define id, title and price with their respective datatypes.'
    }
  ]
},
{
  id: 11,
  name: 'Lesson 11',
  title: 'DROP TABLE Statement - Removing a Table',
  description: 'Learn how to remove an existing table from a database using the DROP TABLE statement.',

  content: {
    points: [
      'The DROP TABLE statement is used to completely remove an existing table from a database.',
      'It removes the table structure as well as all the records stored inside the table.',
      'After a table is dropped, the table no longer exists in the database.',
      'DROP TABLE is different from DELETE because DELETE removes records while keeping the table.',
      'DROP TABLE is also different from ALTER because ALTER modifies the table structure instead of removing the table.',
      'DROP TABLE should be used carefully because the table and its data are removed.'
    ],

    syntax: 'DROP TABLE table_name;',

    example: 'DROP TABLE students;',

    explanation: [
      'DROP TABLE tells SQL that we want to remove an entire table.',
      'students is the name of the table that we want to remove.',
      'After executing the statement, the students table will no longer exist.',
      'The records stored inside the table are also removed.',
      'Unlike DELETE, DROP TABLE removes the complete table structure.'
    ]
  },

  query: 'DROP TABLE students;',

  hint: 'Use DROP TABLE followed by the name of the table you want to remove.',

  difficulty: 'Medium',

  quiz: {
    question: 'Which SQL statement is used to completely remove a table?',
    options: [
      'DELETE TABLE',
      'REMOVE TABLE',
      'DROP TABLE',
      'ALTER TABLE'
    ],
    correctAnswer: 2,
    explanation: 'DROP TABLE is used to completely remove a table and its data.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Drop the students table.',
      query: 'DROP TABLE students;',
      hint: 'Use DROP TABLE followed by the table name.'
    },
    {
      id: 2,
      description: 'Drop the teachers table.',
      query: 'DROP TABLE teachers;',
      hint: 'Use DROP TABLE teachers.'
    },
    {
      id: 3,
      description: 'Drop the courses table.',
      query: 'DROP TABLE courses;',
      hint: 'Use DROP TABLE followed by courses.'
    },
    {
      id: 4,
      description: 'Drop the departments table.',
      query: 'DROP TABLE departments;',
      hint: 'Use DROP TABLE departments.'
    },
    {
      id: 5,
      description: 'Drop the books table.',
      query: 'DROP TABLE books;',
      hint: 'Use DROP TABLE followed by books.'
    }
  ]
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
      'TRUNCATE is different from DROP because DROP removes the complete table structure.'
    ],

    syntax: 'TRUNCATE TABLE table_name;',

    example: 'TRUNCATE TABLE students;',

    explanation: [
      'TRUNCATE TABLE tells SQL that we want to remove all records from a table.',
      'students is the name of the table whose records will be removed.',
      'All rows from the students table will be removed.',
      'The students table itself will still exist after TRUNCATE.',
      'Unlike DROP TABLE, TRUNCATE does not remove the table structure.',
      'Unlike DELETE, TRUNCATE does not allow us to select individual records using WHERE.'
    ]
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
      'Only one record'
    ],
    correctAnswer: 2,
    explanation: 'TRUNCATE removes all records from a table while keeping the table structure.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Remove all records from the students table.',
      query: 'TRUNCATE TABLE students;',
      hint: 'Use TRUNCATE TABLE followed by students.'
    },
    {
      id: 2,
      description: 'Remove all records from the teachers table.',
      query: 'TRUNCATE TABLE teachers;',
      hint: 'Use TRUNCATE TABLE teachers.'
    },
    {
      id: 3,
      description: 'Remove all records from the courses table.',
      query: 'TRUNCATE TABLE courses;',
      hint: 'Use TRUNCATE TABLE followed by courses.'
    },
    {
      id: 4,
      description: 'Remove all records from the departments table.',
      query: 'TRUNCATE TABLE departments;',
      hint: 'Use TRUNCATE TABLE departments.'
    },
    {
      id: 5,
      description: 'Remove all records from the books table.',
      query: 'TRUNCATE TABLE books;',
      hint: 'Use TRUNCATE TABLE followed by books.'
    }
  ]
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
      'It only removes duplicate values from the query result.'
    ],

    syntax: 'SELECT DISTINCT column_name\nFROM table_name;',

    example: 'SELECT DISTINCT department\nFROM employees;',

    explanation: [
      'SELECT DISTINCT tells SQL that we want only unique values.',
      'department is the column from which we want to find unique values.',
      'FROM employees tells SQL to get the data from the employees table.',
      'If the same department appears multiple times, it will be displayed only once.',
      'DISTINCT changes only the displayed result; it does not remove data from the table.'
    ]
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
      'To sort records'
    ],
    correctAnswer: 1,
    explanation: 'DISTINCT is used to display only unique values and remove duplicates from the query result.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Display unique departments from the employees table.',
      query: 'SELECT DISTINCT department FROM employees;',
      hint: 'Use SELECT DISTINCT followed by department.'
    },
    {
      id: 2,
      description: 'Display unique names from the employees table.',
      query: 'SELECT DISTINCT name FROM employees;',
      hint: 'Use DISTINCT with the name column.'
    },
    {
      id: 3,
      description: 'Display unique statuses from the orders table.',
      query: 'SELECT DISTINCT status FROM orders;',
      hint: 'Use DISTINCT with the status column.'
    },
    {
      id: 4,
      description: 'Display unique ages from the users table.',
      query: 'SELECT DISTINCT age FROM users;',
      hint: 'Use DISTINCT with the age column.'
    },
    {
      id: 5,
      description: 'Display unique prices from the products table.',
      query: 'SELECT DISTINCT price FROM products;',
      hint: 'Use DISTINCT with the price column.'
    }
  ]
},
{
  id: 15,
  name: 'Lesson 15',
  title: 'OR Operator - Using Alternative Conditions',
  description: 'Learn how to use the OR operator to filter records based on alternative conditions.',

  content: {
    points: [
      'The OR operator is used to combine two or more conditions in a SQL query.',
      'It returns a record when at least one of the specified conditions is true.',
      'OR is commonly used with the WHERE clause.',
      'It is useful when we want to search for records matching different conditions.',
      'Multiple OR conditions can be used in the same SQL query.',
      'Unlike AND, OR does not require all conditions to be true.'
    ],

    syntax: 'SELECT column1, column2\nFROM table_name\nWHERE condition1 OR condition2;',

    example: 'SELECT * FROM users\nWHERE age < 20 OR age > 30;',

    explanation: [
      'SELECT * tells SQL to display all columns.',
      'FROM users tells SQL to retrieve data from the users table.',
      'WHERE age < 20 checks whether the age is less than 20.',
      'OR age > 30 checks whether the age is greater than 30.',
      'A user will be displayed if either one of these conditions is true.',
      'OR is useful when we want to allow more than one possible condition.'
    ]
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
      'Creates a new table'
    ],
    correctAnswer: 1,
    explanation: 'The OR operator returns records when at least one of the specified conditions is true.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Display users whose age is less than 20 or greater than 30.',
      query: 'SELECT * FROM users WHERE age < 20 OR age > 30;',
      hint: 'Use two age conditions connected with OR.'
    },
    {
      id: 2,
      description: 'Display products whose price is less than 100 or stock is greater than 50.',
      query: 'SELECT * FROM products WHERE price < 100 OR stock > 50;',
      hint: 'Use price and stock conditions with OR.'
    },
    {
      id: 3,
      description: 'Display employees who work in IT or HR.',
      query: 'SELECT * FROM employees WHERE department = \'IT\' OR department = \'HR\';',
      hint: 'Use two department conditions connected with OR.'
    },
    {
      id: 4,
      description: 'Display orders whose status is Completed or Pending.',
      query: 'SELECT * FROM orders WHERE status = \'Completed\' OR status = \'Pending\';',
      hint: 'Use two status conditions with OR.'
    },
    {
      id: 5,
      description: 'Display users whose age is 18 or 25.',
      query: 'SELECT * FROM users WHERE age = 18 OR age = 25;',
      hint: 'Use two age conditions connected with OR.'
    }
  ]
},
{
  id: 16,
  name: 'Lesson 16',
  title: 'NOT Operator - Excluding Conditions',
  description: 'Learn how to use the NOT operator to exclude records that match a condition.',

  content: {
    points: [
      'The NOT operator is used to reverse the result of a condition.',
      'It returns records that do not satisfy the specified condition.',
      'NOT is commonly used with the WHERE clause.',
      'It is useful when we want to exclude specific values or conditions.',
      'NOT can be used with conditions such as IN, LIKE and other comparison conditions.',
      'NOT helps us filter out unwanted records from the result.'
    ],

    syntax: 'SELECT column1, column2\nFROM table_name\nWHERE NOT condition;',

    example: 'SELECT * FROM employees\nWHERE NOT department = \'IT\';',

    explanation: [
      'SELECT * tells SQL to display all columns.',
      'FROM employees tells SQL to retrieve data from the employees table.',
      'NOT reverses the condition that follows it.',
      'department = \'IT\' identifies employees who work in the IT department.',
      'NOT department = \'IT\' excludes IT employees from the result.',
      'The result contains employees who do not belong to the IT department.'
    ]
  },

  query: 'SELECT * FROM employees WHERE NOT department = \'IT\';',

  hint: 'Use NOT before the condition that you want to exclude.',

  difficulty: 'Medium',

  quiz: {
    question: 'What is the purpose of the NOT operator in SQL?',
    options: [
      'To add a new record',
      'To reverse or exclude a condition',
      'To sort records',
      'To create a table'
    ],
    correctAnswer: 1,
    explanation: 'NOT reverses a condition and can be used to exclude records that match that condition.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Display employees who do not work in the IT department.',
      query: 'SELECT * FROM employees WHERE NOT department = \'IT\';',
      hint: 'Use NOT before the department condition.'
    },
    {
      id: 2,
      description: 'Display users whose age is not 25.',
      query: 'SELECT * FROM users WHERE NOT age = 25;',
      hint: 'Use NOT before the age condition.'
    },
    {
      id: 3,
      description: 'Display products whose stock is not 0.',
      query: 'SELECT * FROM products WHERE NOT stock = 0;',
      hint: 'Use NOT before the stock condition.'
    },
    {
      id: 4,
      description: 'Display orders whose status is not Pending.',
      query: 'SELECT * FROM orders WHERE NOT status = \'Pending\';',
      hint: 'Use NOT before the status condition.'
    },
    {
      id: 5,
      description: 'Display customers who are not active.',
      query: 'SELECT * FROM customers WHERE NOT is_active = 1;',
      hint: 'Use NOT before the is_active condition.'
    }
  ]
},
{
  id: 17,
  name: 'Lesson 17',
  title: 'IN Operator - Matching Multiple Values',
  description: 'Learn how to use the IN operator to match multiple possible values.',

  content: {
    points: [
      'The IN operator is used to check whether a value matches any value in a given list.',
      'It is commonly used with the WHERE clause.',
      'IN makes queries shorter and easier to read when checking multiple values.',
      'It can be used with text, numbers, and other suitable values.',
      'The IN operator is an alternative to writing multiple OR conditions.',
      'If a column value matches any value in the IN list, that record is included in the result.'
    ],

    syntax: 'SELECT column1, column2\nFROM table_name\nWHERE column_name IN (value1, value2, value3);',

    example: 'SELECT * FROM employees\nWHERE department IN (\'IT\', \'HR\');',

    explanation: [
      'SELECT * tells SQL to display all columns.',
      'FROM employees tells SQL to retrieve data from the employees table.',
      'WHERE department IN checks the department column against the given list.',
      '\'IT\' and \'HR\' are the values we want to match.',
      'Employees belonging to either IT or HR will be displayed.',
      'IN is simpler than writing department = \'IT\' OR department = \'HR\'.'
    ]
  },

  query: 'SELECT * FROM employees WHERE department IN (\'IT\', \'HR\');',

  hint: 'Use IN after the column name and put the possible values inside parentheses.',

  difficulty: 'Easy',

  quiz: {
    question: 'What is the purpose of the IN operator in SQL?',
    options: [
      'To create a table',
      'To match a value with multiple possible values',
      'To delete a table',
      'To sort records'
    ],
    correctAnswer: 1,
    explanation: 'IN is used to check whether a value matches any value from a specified list.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Display employees who work in IT or HR.',
      query: 'SELECT * FROM employees WHERE department IN (\'IT\', \'HR\');',
      hint: 'Use IN with IT and HR.'
    },
    {
      id: 2,
      description: 'Display users whose age is 20, 25, or 30.',
      query: 'SELECT * FROM users WHERE age IN (20, 25, 30);',
      hint: 'Put the three ages inside IN parentheses.'
    },
    {
      id: 3,
      description: 'Display products whose stock is 10, 20, or 30.',
      query: 'SELECT * FROM products WHERE stock IN (10, 20, 30);',
      hint: 'Use IN with the stock column.'
    },
    {
      id: 4,
      description: 'Display orders whose status is Pending or Completed.',
      query: 'SELECT * FROM orders WHERE status IN (\'Pending\', \'Completed\');',
      hint: 'Use IN with the two status values.'
    },
    {
      id: 5,
      description: 'Display customers whose id is 1, 2, or 3.',
      query: 'SELECT * FROM customers WHERE id IN (1, 2, 3);',
      hint: 'Use IN with the id column and the three numbers.'
    }
  ]
},
{
  id: 18,
  name: 'Lesson 18',
  title: 'BETWEEN Operator - Selecting a Range',
  description: 'Learn how to use the BETWEEN operator to filter values within a specific range.',

  content: {
    points: [
      'The BETWEEN operator is used to select values within a specific range.',
      'It is commonly used with the WHERE clause.',
      'BETWEEN includes both the starting value and the ending value.',
      'It can be used with numbers, dates, and other comparable values.',
      'BETWEEN is useful when we want to find records within a particular range.',
      'The NOT BETWEEN operator can be used when we want values outside a specific range.'
    ],

    syntax: 'SELECT column1, column2\nFROM table_name\nWHERE column_name BETWEEN value1 AND value2;',

    example: 'SELECT * FROM users\nWHERE age BETWEEN 20 AND 30;',

    explanation: [
      'SELECT * tells SQL to display all columns.',
      'FROM users tells SQL to retrieve data from the users table.',
      'WHERE age BETWEEN 20 AND 30 filters users whose age is within the specified range.',
      'BETWEEN includes both 20 and 30.',
      'For example, users with ages 20, 25 and 30 can be included in the result.',
      'BETWEEN makes range-based filtering easier to write.'
    ]
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
      'Sorting records'
    ],
    correctAnswer: 1,
    explanation: 'BETWEEN is used to filter values that fall within a specified range.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Display users whose age is between 20 and 30.',
      query: 'SELECT * FROM users WHERE age BETWEEN 20 AND 30;',
      hint: 'Use BETWEEN 20 AND 30 with the age column.'
    },
    {
      id: 2,
      description: 'Display products whose price is between 100 and 500.',
      query: 'SELECT * FROM products WHERE price BETWEEN 100 AND 500;',
      hint: 'Use BETWEEN with the price column.'
    },
    {
      id: 3,
      description: 'Display employees whose salary is between 30000 and 60000.',
      query: 'SELECT * FROM employees WHERE salary BETWEEN 30000 AND 60000;',
      hint: 'Use BETWEEN with the salary column.'
    },
    {
      id: 4,
      description: 'Display orders whose customer_id is between 1 and 5.',
      query: 'SELECT * FROM orders WHERE customer_id BETWEEN 1 AND 5;',
      hint: 'Use BETWEEN with customer_id.'
    },
    {
      id: 5,
      description: 'Display customers whose id is between 1 and 3.',
      query: 'SELECT * FROM customers WHERE id BETWEEN 1 AND 3;',
      hint: 'Use BETWEEN with the id column.'
    }
  ]
},
{
  id: 19,
  name: 'Lesson 19',
  title: 'LIKE Operator - Pattern Matching',
  description: 'Learn how to search for records that match a specific pattern using the LIKE operator.',

  content: {
    points: [
      'The LIKE operator is used to search for a specific pattern in text values.',
      'It is commonly used with the WHERE clause.',
      'The % wildcard represents zero or more characters.',
      'The _ wildcard represents exactly one character.',
      'LIKE is useful when we do not know the complete text value.',
      'LIKE can be used to search for names, emails, departments and other text data.'
    ],

    syntax: 'SELECT column1, column2\nFROM table_name\nWHERE column_name LIKE pattern;',

    example: 'SELECT * FROM users\nWHERE name LIKE \'A%\';',

    explanation: [
      'SELECT * tells SQL to display all columns.',
      'FROM users tells SQL to retrieve data from the users table.',
      'WHERE name LIKE \'A%\' searches for names that start with the letter A.',
      'The % symbol means that any number of characters can appear after A.',
      'For example, names such as Amit or Ankit can match this pattern.',
      'LIKE is useful for pattern-based searching instead of exact matching.'
    ]
  },

  query: 'SELECT * FROM users WHERE name LIKE \'A%\';',

  hint: 'Use LIKE after the column name and use % as a wildcard for multiple characters.',

  difficulty: 'Medium',

  quiz: {
    question: 'Which wildcard represents zero or more characters with LIKE?',
    options: [
      '_',
      '%',
      '#',
      '*'
    ],
    correctAnswer: 1,
    explanation: 'The % wildcard represents zero or more characters when used with LIKE.'
  },

  practiceQuestions: [
    {
      id: 1,
      description: 'Display users whose name starts with A.',
      query: 'SELECT * FROM users WHERE name LIKE \'A%\';',
      hint: 'Use A followed by %.'
    },
    {
      id: 2,
      description: 'Display users whose name ends with a.',
      query: 'SELECT * FROM users WHERE name LIKE \'%a\';',
      hint: 'Put % before the letter a.'
    },
    {
      id: 3,
      description: 'Display users whose name contains the letter h.',
      query: 'SELECT * FROM users WHERE name LIKE \'%h%\';',
      hint: 'Put % before and after h.'
    },
    {
      id: 4,
      description: 'Display employees whose department starts with I.',
      query: 'SELECT * FROM employees WHERE department LIKE \'I%\';',
      hint: 'Use I followed by %.'
    },
    {
      id: 5,
      description: 'Display customers whose email ends with gmail.com.',
      query: 'SELECT * FROM customers WHERE email LIKE \'%gmail.com\';',
      hint: 'Put % before gmail.com.'
    }
  ]
},
  ];

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
    this.feedbackMessage = `Hint: ${this.currentLesson.hint}`;
    this.taskCompleted = false;
  }

  checkQuery(): void {
    if (
      this.sqlInput.trim().toLowerCase() === this.currentPracticeQuestion.query.trim().toLowerCase()
    ) {
      this.feedbackMessage = 'Correct! Practice query is right.';
      this.taskCompleted = true;
      this.incrementXP(50);
      this.updateProgress(true);
    } else {
      this.feedbackMessage = 'Not correct. Try again or use the hint.';
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
      this.feedbackMessage = 'Please select an option.';
      return;
    }

    if (this.selectedQuizAnswer === this.currentLesson.quiz.correctAnswer) {
      this.feedbackMessage = `Correct! ${this.currentLesson.quiz.explanation}`;
      this.quizAnswered = true;
      this.incrementXP(30);
      this.updateProgress(true);
    } else {
      this.feedbackMessage = `Incorrect. ${this.currentLesson.quiz.explanation}`;
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
    this.feedbackMessage = '';
    this.taskCompleted = false;
    this.showNotes = false;
    this.selectedQuizAnswer = null;
    this.quizAnswered = false;
  }

  toggleNotes(): void {
    this.showNotes = !this.showNotes;
  }

  incrementXP(amount: number): void {
    this.userXP += amount;
  }

  updateProgress(success: boolean): void {
    fetch('/api/progress', {
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
