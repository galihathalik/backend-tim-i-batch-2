import { Request } from 'express';
import { User } from 'src/entities/users.entity';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;