import { SafeApp } from '..';
import { appConfig } from './configs/app.config';
import { userRouter } from './services/user.router';

const PORT = 3000;

const app = new SafeApp(appConfig);

app.useRouter('/api/v1/user', userRouter);
app.listen(PORT);

export { app };
