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
  content: string;
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
      content:
        'The SELECT statement is the most basic and commonly used SQL command. It allows you to retrieve data from one or more database tables. The syntax is: SELECT column1, column2, ... FROM table_name; Use SELECT * to retrieve all columns.',
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
      content:
        'The WHERE clause is used to filter records based on specified conditions. You can use comparison operators like > (greater than), < (less than), = (equal to), and != (not equal to). Example: SELECT * FROM users WHERE age > 25; retrieves all users older than 25.',
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
      content:
        'Instead of using SELECT *, you can specify individual columns separated by commas. This is more efficient and returns only the data you need. Example: SELECT name, email FROM users; retrieves only the name and email columns.',
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
      content:
        'The ORDER BY clause sorts the results. Use ASC for ascending order (default) or DESC for descending order. Example: SELECT * FROM users ORDER BY age ASC; sorts users by age from youngest to oldest.',
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
      content:
        'Aggregate functions perform calculations on data. COUNT(*) returns the number of rows in a table. Example: SELECT COUNT(*) FROM users; returns the total number of users in the database.',
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
