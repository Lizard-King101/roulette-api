import axios from "axios";
import PiNetwork from 'pi-backend';
import { PaymentDTO } from "pi-backend/dist/types";
import { getAxiosClient } from "pi-backend/dist/utils";
import { PaymentRow } from "./pi";
import { NocoDB } from "../../modules/noco";
import { Api } from "nocodb-sdk";
import { AccountRow } from "../account/account";
// service for handling messages routes

export class PiService {
    pi: PiNetwork;
    db: Api<unknown>
    constructor() {
        let { apiKey, privateSeed } = global.config.pi;
        this.pi = new PiNetwork(apiKey, privateSeed);
        this.db = NocoDB.getAPI();
    }

    public async approve(paymentId: string) {
        let ax = getAxiosClient(global.config.pi.apiKey, {})
        let result = await ax.post<PaymentDTO>(`/v2/payments/${paymentId}/approve`).catch((error) => {
            console.log(error);
            
        })
        
        console.log('Payment Approved', paymentId);
        return result?.data
    }

    public async confirm(paymentId: string, txid: string) {
        let payment = await this.pi.completePayment(paymentId, txid);
        console.log('Check Payment', payment);
        
        if(payment.status.transaction_verified && payment.status.developer_approved) {
            let paymentRow = {
                UID: payment.user_uid,
                Amount: payment.amount,
                TXID: payment.transaction?.txid,
                Identifier: payment.identifier,
                CreatedAt: payment.created_at
            } as PaymentRow;

            await this.InsertPayment(paymentRow);

            console.log('Payment Confirmed', payment.identifier);
            
        }

        return payment;
    }

    public async withdraw(uid: string, amount: number) {
        let exists = <AccountRow> await this.db.dbTableRow.findOne('noco', 'pi-roulette', 'accounts', {
            fields: ['UID', 'Balance', 'CreatedAt', 'Id'],
            where: `(UID,eq,${uid})`
        });
        if(Object.keys(exists).length == 0) throw Error('Account not found');

        if(exists.Balance - amount < 0) throw Error('Insuficient balance');

        let withdrawAmount = amount / 1000;

        let id = await this.pi.createPayment({
            amount: withdrawAmount,
            memo: 'Withdraw Tokens',
            metadata: {
                token_amount: amount,
            },
            uid
        }).catch((error) => {
            console.log(error);
            
        });

        if(!id) return;
        console.log('Payment created', id);
        
        return await this.pi.submitPayment(id)
    }

    static async completeServerPayment(pi: PiNetwork, payment: PaymentDTO) {
        let result = await pi.submitPayment(payment.identifier).catch((error) => {
            let data = error.response.data
            console.log(data.extras);
            
        });

        if(!result) return;
        let complete = pi.completePayment(payment.identifier, result);
        return complete;
    }

    static async cancelServerPayment(pi: PiNetwork, payment: PaymentDTO) {
        let canceled = pi.cancelPayment(payment.identifier).catch((error) => {
            console.log(error);
            
        });

    }


    private async InsertPayment(payment: PaymentRow) {
        
        let exists = await this.db.dbTableRow.findOne('noco', 'pi-roulette', 'payments', {
            fields: ['UID', 'Amount', 'Identifier', 'TXID'],
            where: `(Identifier,eq,${payment.Identifier})`
        });

        if(Object.keys(exists).length == 0) {
            let inserted = await this.db.dbTableRow.create('noco', 'pi-roulette', 'payments', payment)
            console.log(inserted);
            
            await this.UpdateAccount(payment);

            return inserted;
        } else {
            return exists;
        }
    }

    private async UpdateAccount(payment: PaymentRow) {
        
        let exists = <AccountRow> await this.db.dbTableRow.findOne('noco', 'pi-roulette', 'accounts', {
            fields: ['UID', 'Balance', 'CreatedAt', 'Id'],
            where: `(UID,eq,${payment.UID})`
        });
        
        console.log('Update Account', exists);

        if(Object.keys(exists).length == 0) {
            
            let newAccount = {
                UID: payment.UID,
                Balance: payment.Amount * 1000
            }
            let inserted = await this.db.dbTableRow.create('noco', 'pi-roulette', 'accounts', newAccount);
            console.log('New Account', inserted);
            return inserted;
        } else {
            
            
            let newBalance = exists.Balance + (payment.Amount * 1000);
            let updated = await this.db.dbTableRow.update('noco', 'pi-roulette', 'accounts', exists.Id, {Balance: newBalance});
            console.log('Update Existing', updated);
            return updated
        }
    }

}