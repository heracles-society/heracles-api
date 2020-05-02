import { Mongoose } from 'mongoose';
import { OrganizationSchema } from './schemas/organization.schema';
import { ORGANIZATION_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

export const organizationsProviders = [
  {
    provide: ORGANIZATION_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Organization', OrganizationSchema),
    inject: [DATABASE_CONNECTION],
  },
];
