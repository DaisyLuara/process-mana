const processState = {
  state: {
    contractCount: 0,
    invoiceCount: 0,
    paymentCount: 0
  },
  mutations: {
    saveProcessState(state, obj) {
      state.contractCount = obj.contract_count
      state.invoiceCount = obj.invoice_count
      state.paymentCount = obj.payment_Count
    }
  },
  actions: {}
}

export default processState
