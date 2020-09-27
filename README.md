# Reφenes

## What is Refenes

Refenes is an online tool to manage the common bill with your friends. The name itself comes from greek `ρεφενές` which comes from turkish `refene` witch comes from persian `عارفانه` (arefaneh) and means `individual share in a collective cost for food, entertainment , etc.` [1]

Here in Greece we used not to split the bill if we go out. Each time someone will pay and eventually at some point we will get even. This give us the time to actually accurate and not to look for changes in our wallets, plus if someone don't have money we sure want him to our company. Now with the economic crisis the problem is that no one have money to cover the others. More than one person pays each time, making  common the reaction `I have lost the ball`

Refenes keep tracking these expenses accurately and throwing some math to simplify the final transactions.

## How it works

Follow the next example:

	The party is Bill, Mary, John and Paul
	1. Bill give 15€ for all members of the party
	2. Mary give 25€ for Bill, John and her
	3. Paul give 10€ for Bill

According to the above

|   | B | M | P | J |
|---|---|---|---|---|
| B | X | 3.75 | 3.75 | 3.75 |
| M | 8.33 | X |   | 8.33 |
| P | 10 |   | X |   |
| J |   |   |   | X |

After the first round of simplification

	i = j = 1..members
	x = [i,j]-[j,i]

|   | B | M | P | J |
|---|---|---|---|---|
| B | X | 0 | 0 | 3.75 |
| M | 4.58 | X |   | 8.33 |
| P | 6,25 |   | X |   |
| J |   |   |   | X |

	1. Bill should get 3.75€ from John
	2. Mary should get 4.58€ from Bill and 8.33€ from John
	3. Paul should get 6.25€ from Bill

[1]: http://el.wiktionary.org/wiki/%CF%81%CE%B5%CF%86%CE%B5%CE%BD%CE%AD%CF%82
