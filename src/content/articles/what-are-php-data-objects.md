---
title: "What Are PHP Data Objects?"
date: 2017-06-11
description: "Since I've been diving into PHP lately, I've been working my way through the former book and came upon the SQL chapter which had something interesting: PHP Data Objects, or PDO. My brief understanding of it is that it is a preferred way to avoid SQL Injection attacks. After reading around some about it, it sounds a lot like Active Record for Ruby. It is an abstraction on top of typical database commands that makes accessing it more predictable and secure."
tags:
  - sql
---

Reading programming books is an essential part of learning for me, half because I learn well by seeing examples and half because I spend so much time on the subway in the morning and evening. Having a book like [PHP The Right Way](http://www.phptherightway.com) or You Don't Know JS let's me fill in gaps in my knowledge while zipping through the dim tunnels of Manhattan & Brooklyn.

Since I've been diving into PHP lately, I've been working my way through the former book and came upon the [SQL chapter](http://www.phptherightway.com/#pdo_extension) which had something interesting: PHP Data Objects, or PDO. My brief understanding of it is that it is a preferred way to avoid SQL Injection attacks (see [Privacy Day post](https://steveafrost.com/protect-yoself-data-privacy-day-2017)). After reading around some about it, it sounds a lot like Active Record for Ruby. That is, it's an abstraction on top of typical database commands that makes accessing it more predictable and secure.

PDO is not critical of what type of database it communicates with so it could be SQLite, MySQL, Postgres, etc. There are a few functions we can use within the PDO namespace to reveal information, connect to the database, set errors, and catch exceptions.

* `PDO::getAvailableDrivers();` will reveal what drivers are available on your machine or remote server.
* `$handler = new PDO('mysql:host=ipaddress;dbname=dbname', 'username', 'password');` to initiate a connection to the database using PDO.
* `$handler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);`
* To catch this exception, use `PDOException`

Once you've created a new PDO object and initiated a connection with the database, use $handler->query to use any SQL command like SELECT, WHERE, FROM, etc. For example: `$handler->query('SELECT * FROM TABLE')`.

From there, you can iterate and manipulate the data however you like. PDO provides numerous other methods for things like setting default fetch mode, fetch group, fetch by column, and so on. You can read about them all at the ["only proper guide" to PDO](https://phpdelusions.net/pdo).
