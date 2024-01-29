"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NIKVerificationStatus = exports.PoliticalParty = exports.ReportCategory = exports.Role = exports.NotificationType = exports.ThreadType = void 0;
var ThreadType;
(function (ThreadType) {
    ThreadType["AGREE"] = "Setuju";
    ThreadType["DISAGREE"] = "Menentang";
    ThreadType["NEUTRAL"] = "Netral";
})(ThreadType || (exports.ThreadType = ThreadType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["UPVOTE"] = "upvote";
    NotificationType["DOWNVOTE"] = "downvote";
    NotificationType["BROADCAST"] = "broadcast";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
    Role["SUPER_ADMIN"] = "super_admin";
})(Role || (exports.Role = Role = {}));
var ReportCategory;
(function (ReportCategory) {
    ReportCategory["HATE"] = "hate";
    ReportCategory["ABUSE_HARASSMENT"] = "abuse_harassment";
    ReportCategory["VIOLENT_SPEECH"] = "violent_speech";
    ReportCategory["SPAM"] = "spam";
    ReportCategory["PRIVACY"] = "privacy";
    ReportCategory["OTHERS"] = "others";
})(ReportCategory || (exports.ReportCategory = ReportCategory = {}));
var PoliticalParty;
(function (PoliticalParty) {
    PoliticalParty["PKB"] = "Partai Kebangkitan Bangsa";
    PoliticalParty["GERINDRA"] = "Partai Gerindra";
    PoliticalParty["PDIP"] = "Partai Demokrasi Indonesia Perjuangan";
    PoliticalParty["GOLKAR"] = "Partai Golkar";
    PoliticalParty["NASDEM"] = "Partai Nasional Demokrat";
    PoliticalParty["BURUH"] = "Partai Buruh";
    PoliticalParty["GELORA"] = "Partai Gelora";
    PoliticalParty["PKS"] = "Partai Keadilan Sejahtera";
    PoliticalParty["PKN"] = "Partai Kebangkitan Nusantara";
    PoliticalParty["HANURA"] = "Partai Hanura";
    PoliticalParty["GARUDA"] = "Partai Garuda";
    PoliticalParty["PAN"] = "Partai Amanat Nasional";
    PoliticalParty["PBB"] = "Partai Bulan Bintang";
    PoliticalParty["DEMOKRAT"] = "Partai Demokrat";
    PoliticalParty["PSI"] = "Partai Solidaritas Indonesia";
    PoliticalParty["PERINDO"] = "Partai Perindo";
    PoliticalParty["PPP"] = "Partai Persatuan Pembangunan";
    PoliticalParty["PU"] = "Partai Ummat";
})(PoliticalParty || (exports.PoliticalParty = PoliticalParty = {}));
var NIKVerificationStatus;
(function (NIKVerificationStatus) {
    NIKVerificationStatus["DRAFT"] = "draft";
    NIKVerificationStatus["PENDING"] = "pending";
    NIKVerificationStatus["VERIFIED"] = "verified";
    NIKVerificationStatus["REJECTED"] = "rejected";
})(NIKVerificationStatus || (exports.NIKVerificationStatus = NIKVerificationStatus = {}));
