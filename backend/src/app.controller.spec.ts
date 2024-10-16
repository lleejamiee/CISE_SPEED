import { Test, TestingModule } from '@nestjs/testing';
import { SeMethodController } from '../api/semethod/semethod.controller'
import { SeMethodService } from '../api/semethod/semethod.service';
import { ClaimDTO } from '../api/semethod/semethod.dto';
import { SeMethod } from '../api/semethod/semethod.schema';
import { ArticleController } from '../api/articles/article.controller';
import { ArticleService } from '../api/articles/article.service';


describe('ArticleController', () => {
  let articleController: ArticleController;
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 let articleService: ArticleService;
 
  const mockArticleService = {
    addRating: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    articleController = module.get<ArticleController>(ArticleController);
    articleService = module.get<ArticleService>(ArticleService);
  });

  describe('rateArticle', () => {
    it('should add a rating to an article and return a success message', async () => {
      const articleId = '123';
      const rating = 5;

      const result = await articleController.rateArticle(articleId, rating);

      expect(mockArticleService.addRating).toHaveBeenCalledWith(articleId, rating);
      expect(result).toEqual({ message: 'Rating added successfully' });
    });
  });
});


describe('SeMethodController', () => {
  let controller: SeMethodController;
  let service: SeMethodService;

  const mockSeMethod = { id: '1', name: 'Test Method', claims: [] } as SeMethod;
  const mockClaimDTO: ClaimDTO = { name: 'Test Claim' };

  const mockSeMethodService = {
    create: jest.fn().mockResolvedValue(mockSeMethod),
    findAll: jest.fn().mockResolvedValue([mockSeMethod]),
    findOne: jest.fn().mockResolvedValue(mockSeMethod),
    update: jest.fn().mockResolvedValue(mockSeMethod),
    delete: jest.fn().mockResolvedValue(mockSeMethod),
    addClaim: jest.fn().mockResolvedValue(mockSeMethod),
    getAllClaims: jest.fn().mockResolvedValue(mockSeMethod.claims),
    getClaim: jest.fn().mockResolvedValue(mockClaimDTO),
    updateClaim: jest.fn().mockResolvedValue(mockSeMethod),
    deleteClaim: jest.fn().mockResolvedValue(mockSeMethod),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeMethodController],
      providers: [
        {
          provide: SeMethodService,
          useValue: mockSeMethodService,
        },
      ],
    }).compile();

    controller = module.get<SeMethodController>(SeMethodController);
    service = module.get<SeMethodService>(SeMethodService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllSeMethods', () => {
    it('should return an array of SeMethods', async () => {
      const result = await controller.getAllSeMethods();
      expect(result).toEqual([mockSeMethod]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getSeMethod', () => {
    it('should return a single SeMethod', async () => {
      const result = await controller.getSeMethod('1');
      expect(result).toEqual(mockSeMethod);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllClaims', () => {
    it('should return all claims for a SeMethod', async () => {
      const result = await controller.getAllClaims('1');
      expect(result).toEqual(mockSeMethod.claims);
      expect(service.getAllClaims).toHaveBeenCalledWith('1');
    });
  });

  describe('getClaim', () => {
    it('should return a claim by index', async () => {
      const result = await controller.getClaim('1', 0);
      expect(result).toEqual(mockClaimDTO);
      expect(service.getClaim).toHaveBeenCalledWith('1', 0);
    });
  });
});