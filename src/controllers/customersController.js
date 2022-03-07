import db from '../database.js';
import dayjs from 'dayjs';
import Joi from 'joi';

export async function getCustomers(req, res) {
    const string = req.query.cpf;
    try {
        if (typeof string === "string") {
            const result = await db.query(`
            SELECT * 
            FROM customers
            WHERE customers.cpf LIKE '${string}%'
          `,);
            res.send(result.rows);
        }
        else {
            const result = await db.query(`
            SELECT * 
            FROM customers
          `);
            res.send(result.rows);
        }
    } catch (erro) {
        res.status(500).send(erro);
    }
}

export async function getCustomer(req, res) {
    const { id } = req.params;
  
    try {
  
      const { rows: customers } = await db.query(`
        SELECT * FROM customers
          WHERE id=$1
      `, [id]);
  
      if (customers.length === 0) {
        res.sendStatus(404);
        return
      }
  
      res.send(customers[0]);
    } catch (erro) {
      console.log(erro);
      res.sendStatus(500);
    }
  }

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const formatBirthday = dayjs(birthday).format('DD/MM/YYYY');
    try {

        const result = await db.query(`SELECT id FROM customers WHERE cpf=$1`, [cpf]);
        if (result.rows.length > 0) {
            return res.status(409).send('cpf já cadastrado')
        }


        await db.query(`
          INSERT INTO 
            customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `, [name, phone, cpf, formatBirthday]);

        res.sendStatus(201);

    } catch (erro) {
        res.status(500).send(erro);
    }
}

export async function putCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    const formatBirthday = dayjs(birthday).format('DD/MM/YYYY');
    
    try {
      await db.query(`
        UPDATE customers 
        SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5
      `, [name, phone, cpf, formatBirthday, id]);
  
      res.sendStatus(200);
    } catch (erro) {
      console.log(erro);
      res.sendStatus(500);
    }
  }

