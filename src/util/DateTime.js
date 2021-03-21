const DateTime = {
    formatar(data) {
        return new Date(data)
            .toISOString()
            .split("T")[0];
    }
};

export default DateTime;
