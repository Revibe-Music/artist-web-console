const initialState = {
    showErrorModal: false,
    modalErrorMessage: "",
    error409Messages: {},
    error415Messages: {},
    error417Messages: {},
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "HTTP_404_ERROR":
            return execute404(state, action);
        case "HTTP_500_ERROR":
            return execute500(state, action);
        case "HTTP_OTHER_ERROR":
            return executeOtherError(state, action);
        default:
            return state;
    }
}

export default reducer;
