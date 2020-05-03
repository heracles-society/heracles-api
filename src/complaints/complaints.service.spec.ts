import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintService } from './complaints.service';

describe('ComplaintsService', () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintService],
    }).compile();

    service = module.get<ComplaintService>(ComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
