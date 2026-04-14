import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardsService } from '../../application/cards.service';
import { IssueCardDto } from '../../application/dtos/issue-card.dto';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService
  ) {}

  @Post('issue')
  @ApiOperation({ summary: 'Emitir una tarjeta' })
  async issueCard(@Body() body: IssueCardDto) {
    const response = await this.cardsService.issueCard(body);
    return response;
  }

}