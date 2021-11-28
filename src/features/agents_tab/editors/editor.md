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

What follows is a description of `OP_CODE`s and their arguments.
