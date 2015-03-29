# Refenes.Client

## Schema

	user [username,password]
	account [email,alias,avatar]
	transaction [date,description]
		details [accounts,amount]
	circles [userAccount,otherAccount,isBuddy]
	parties [date,description,accounts]

## Technologies

- Mobile client builded with the `IonicFramework`
- Webservice with `OAuth2` builded with `Symfony2`


## Client

### Special Functions

**Send-a-Note:** Quick creation of a transaction to an account only requiring
the account and the amount. Account is selected from a list and amount comes
from an input custom keyboard.

**NoteFication** An notification will be set off when a new note comes.
Account's details will be available to the user who receiving the note.

**AutoBalancing** General debts are become auto balanced across baddies. Party
debts become auto balanced across party accounts.

### General Views

**Dashboard:** View debts from other accounts grouped by parties, and baddies.
User will have a full aspect of depts.

**Transactions:** List of all transaction history will be visible from this
menu. Transaction will always have a 60 seconds window until become established.
Established transaction can only be deleted if both accounts select so. User
can `force` a transaction in order to establish at once.

**Parties:** CRUDing parties is a social action and all members of the party
are aware of the transactions issued. The parties are entities allowing
`balancing` without requiring member to be `buddies`.

**Accounts:** This is the common `friendlist`. Users can `send-a-note` at
anyone that is not in theirs accountList. Such a note become tagged with
`UnKnown` badge.

### Specific Views

**Pin** User must provide every time he access the app his master pin. The
data become locked by the AES256 algorithm
