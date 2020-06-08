import { Schema, Mongoose, Types } from 'mongoose';
import { ROLE_BINDING_PROVIDER, ROLE_BINDING_MODEL } from './constants';
import { DATABASE_CONNECTION } from '../database/constants';
import { USER_MODEL } from '../user/constants';
import { ROLE_MODEL } from '../role/constants';

const RoleBindingSchema = new Schema(
  {
    name: String,
    kind: String,
    namespace: String,
    subjects: [
      {
        kind: String,
        id: { type: Types.ObjectId, ref: USER_MODEL },
      },
    ],
    roles: [
      {
        id: { type: Types.ObjectId, ref: ROLE_MODEL },
      },
    ],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export class RoleBindingProvider {
  static getProviders() {
    return [
      {
        provide: ROLE_BINDING_PROVIDER,
        useFactory: (mongoose: Mongoose) =>
          mongoose.model(ROLE_BINDING_MODEL, RoleBindingSchema),
        inject: [DATABASE_CONNECTION],
      },
    ];
  }
}
