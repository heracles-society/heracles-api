import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintsController } from './complaints.controller';

describe('Complaints Controller', () => {
  let controller: ComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintsController],
    }).compile();

    controller = module.get<ComplaintsController>(ComplaintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
