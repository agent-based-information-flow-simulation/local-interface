# Editor and Agent Assembler Syntax description

## Statements

Four primary statement types are available in AA:
 - `expr` Expressions, which are arithmetic operations with assignment
 - `decl` Declarations, allowing for declaring floating point named variables
 - `cond` Conditionals, allowing for conditional statements
 - `endc` Statement ending conditional

 ## Variables

 During creation of an Agent's behaviour all of its parameters are available, as well as the following:
 - `connCount` - a variable representing Agent's amount of neighbours in the network
 - `msgRCount` - a variable representing Agent's amount of received msgs
 - `msgSCount` - a variable representing Agent's amount of sent msgs

 ---
**Note:**
 The system defined variables are `read-only` using them as `LHS` will result in an error;

---

## Statement structure

Each statement will have the following stucture:
```
LHS OP RHS
```

And will then compiled into AA code into code in following structure

```
OP_CODE    LHS, RHS
```

`OP_CODE` is guaranteed to be a 4 character alphabetic string. What follows is 4 spaces, and comma separated arguments.

What follows is a description of `OP_CODE`s and their arguments.

### Float
#### Expression
- `ADD ` Add, LHS float, RHS is float, result is LHS incremented by RHS
- `SUBT` Subtract, LHS float, RHS is float, result is LHS decremented by RHS
- `MULT` Multiply, LHS float, RHS is float, result is LHS multiplied by RHS
- `DIV ` Divide, LHS float, RHS is non-zero float, result is LHS divided by RHS
#### Declaration
- `DECL` Declare, LHS valid unique identifier, RHS is float, result is new float variable with LHS UID.
#### Float Conditional
- `LT  ` LessThan operator, true if LHS < RHS
- `GT  ` GreaterThan operator, true if LHS > RHS
- `LTE ` LessThanOrEqual operator, true if LHS <= RHS
- `GTE ` GreaterThanOrEqual operator, true if LHS >= RHS
- `EQ  ` Equality operator, true if LHS == RHS
- `NEQ ` Not equality operator, true if LHS != RHS
#### Enum Conditional
- `EQ  ` Equality operator, true if LHS == RHS
- `NEQ ` Not equality operator, true if LHS != RHS
#### End Conditional
- `FI  ` Ends conditional block


