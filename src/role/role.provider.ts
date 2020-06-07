import { Schema, Mongoose } from 'mongoose';
import { ROLE_PROVIDER, ROLE_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';

const RoleSchema = new Schema(
  {
    name: String,
    kind: String,
    namespace: String,
    rules: [
      {
        resourceKind: String,
        resources: [String],
        actions: [String],
      },
    ],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class RoleProvider {
  static getProviders() {
    return [
      {
        provide: ROLE_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(ROLE_MODEL, RoleSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
