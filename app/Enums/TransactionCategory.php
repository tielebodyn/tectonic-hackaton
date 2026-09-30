<?php

namespace App\Enums;

enum TransactionCategory: string
{
    case Income = 'income';
    case Rent = 'rent';
    case Subscription = 'subscription';
    case Utilities = 'utilities';
    case Insurance = 'insurance';
    case Bnpl = 'bnpl';
    case Tax = 'tax';
    case Groceries = 'groceries';
    case Moving = 'moving';
    case Savings = 'savings';
    case Other = 'other';
}
