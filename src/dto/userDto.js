
export class UserDto {
    constructor(user) {
        this._id = user._id;
        this.username = user.username;
        this.role = user.role;
    }
}