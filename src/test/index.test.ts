import { safe } from '../safe';
import { appConfig } from './configs/app.config';
import { userRouter } from './services/user.router';

const PORT = 3000;

export const app = safe.createApp(appConfig).useRouter(userRouter).listen(PORT);
