import { Test, TestingModule } from '@nestjs/testing';
import { RoleBindingController } from './role-binding.controller';

describe('RoleBinding Controller', () => {
  let controller: RoleBindingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleBindingController],
    }).compile();

    controller = module.get<RoleBindingController>(RoleBindingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
