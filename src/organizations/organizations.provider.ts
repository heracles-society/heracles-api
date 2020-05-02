import { Mongoose } from 'mongoose';
import { OrganizationSchema } from './schemas/organization.schema';
import { ORGANIZATION_MODEL, ORGANIZATION_PROVIDER } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const organizationsProviders = [
  {
    provide: ORGANIZATION_PROVIDER,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(ORGANIZATION_MODEL, OrganizationSchema),
    inject: [DATABASE_CONNECTION],
  },
];
