export default {
    convertDate(date) {
        const newdate = new Date(date)
        if (newdate.getDate() == new Date().getDate()) {
            return (this.formateTimeToAmPmFormat(newdate.getHours(), newdate.getMinutes()))
        } else {
            return (newdate.getDate() + '/' + newdate.getMonth() + '/' + newdate.getFullYear())
        }
    },
    formateTimeToAmPmFormat(hours, minutes) {
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
    },
}
