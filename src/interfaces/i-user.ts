import Gender from "../enums/gender";
import Role from "../enums/role";

interface IUser {
    firstName: string;
    lastName: string;
    gender: Gender;
    email: string;
    password: string;
    roles: Role[];
}

export default IUser;