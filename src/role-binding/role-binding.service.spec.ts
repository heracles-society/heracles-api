import { Test, TestingModule } from '@nestjs/testing';
import { RoleBindingService } from './role-binding.service';

describe('RoleBindingService', () => {
  let service: RoleBindingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleBindingService],
    }).compile();

    service = module.get<RoleBindingService>(RoleBindingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
