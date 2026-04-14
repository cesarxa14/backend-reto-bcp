import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Matches, Min, MinLength, ValidateNested } from 'class-validator';

enum ProductTypeEnum {
  VISA = 'VISA',
}

enum CurrencyEnum {
  PEN = 'PEN',
  USD = 'USD',
}


export enum DocumentTypeEnum {
  DNI = 'DNI'
}

class CustomerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(DocumentTypeEnum, {message: 'documentType Solo permite DNI'})
    documentType!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{8}$/, { message: 'documentNumber: DNI debe tener 8 dígitos numéricos' })
    documentNumber!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullName!: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    age!: number;

    @ApiProperty()
    @IsEmail()
    email!: string;
}

class ProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(ProductTypeEnum, {message: 'type Solo permite VISA'})
    type!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(CurrencyEnum, {message: 'currency Solo permite PEN o USD'})
    currency!: string;
}

export class IssueCardDto {
    @ApiProperty({ type: CustomerDto })
    @ValidateNested()
    @Type(() => CustomerDto)
    customer!: CustomerDto;

    @ApiProperty({ type: ProductDto })
    @ValidateNested()
    @Type(() => ProductDto)
    product!: ProductDto;

    @ApiProperty({ example: false })
    @IsBoolean()
    forceError!: boolean;
}