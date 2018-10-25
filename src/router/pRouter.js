import Home from 'page/home'
import contract from 'router/process/contract'
import company from 'router/process/company'
import inform from 'router/process/inform'
import invoice from 'router/process/invoice'
import payment from 'router/process/payment'

export default {
  path: '/',
  name: '流程站',
  component: Home,
  meta: {
    // permission: 'main',
  },
  children: [contract, invoice, payment, company, inform]
}
