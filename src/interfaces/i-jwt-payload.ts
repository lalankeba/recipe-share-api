import Role from "../enums/role";

interface IJwtPayload {
    jwtid: string;
    email: string;
    roles: Role[];
}

export default IJwtPayload;