//REQUEST
const request_insert =
  "INSERT INTO tblrequest ( userID , certificateID  ,purpose, statusID, r_date, r_time ) " +
  "VALUES ( ? , ( SELECT certificateID FROM tblcertificates WHERE certificateName = ? ), ? , " +
  "( SELECT statusID FROM tblstatus WHERE STATUS = ? ), NOW(), NOW())";

module.exports = {
  request_insert,
};
