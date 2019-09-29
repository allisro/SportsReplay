# MIT 6.034 Lab 1: Rule-Based Systems
# Written by 6.034 staff

from production import IF, AND, OR, NOT, THEN, DELETE, forward_chain, pretty_goal_tree
from data import *
import pprint

pp = pprint.PrettyPrinter(indent=1)
pprint = pp.pprint

#### Part 1: Multiple Choice #########################################

ANSWER_1 = '2'

ANSWER_2 = '4'

ANSWER_3 = '2'

ANSWER_4 = '0'

ANSWER_5 = '3'

ANSWER_6 = '1'

ANSWER_7 = '0'

#### Part 2: Transitive Rule #########################################

# Fill this in with your rule 
transitive_rule = IF( AND( '(?x) beats (?y)', '(?z) beats (?x)' ), THEN( '(?z) beats (?y)' ) )

# You can test your rule by uncommenting these pretty print statements
#  and observing the results printed to your screen after executing lab1.py
#pprint(forward_chain([transitive_rule], abc_data))
#pprint(forward_chain([transitive_rule], poker_data))
#pprint(forward_chain([transitive_rule], minecraft_data))


#### Part 3: Family Relations #########################################

# Define your rules here. We've given you an example rule whose lead you can follow:
duplicate_rule = IF ("person (?x)", THEN ("duplicate (?x) (?x)"))
sibling_rule = IF( AND("person (?x)", "person (?y)","parent (?z) (?x)", "parent (?z) (?y)", NOT("duplicate (?x) (?y)")), THEN ("sibling (?x) (?y)"))
child_rule = IF( "parent (?x) (?y)", THEN ("child (?y) (?x)" ))
cousin_rule = IF( AND("sibling (?x) (?y)", "parent (?x) (?z)", "parent (?y) (?a)"), THEN ("cousin (?z) (?a)", "cousin (?a) (?z)"))
grand_rule = IF( AND("parent (?x) (?y)", "parent (?y) (?z)"), THEN ("grandparent (?x) (?z)", "grandchild (?z) (?x)" ))
# need to eliminate parent sibling x x
# Add your rules to this list:
family_rules = [ duplicate_rule, sibling_rule, child_rule, cousin_rule, grand_rule ]

# Uncomment this to test your data on the Simpsons family:
#pprint(forward_chain(family_rules, simpsons_data, verbose=False))

# These smaller datasets might be helpful for debugging:
#pprint(forward_chain(family_rules, sibling_test_data, verbose=True))
# pprint(forward_chain(family_rules, grandparent_test_data, verbose=True))

# The following should generate 14 cousin relationships, representing 7 pairs
# of people who are cousins:
black_family_cousins = [
    relation for relation in
    forward_chain(family_rules, black_data, verbose=False)
    if "cousin" in relation ]

# To see if you found them all, uncomment this line:
# pprint(black_family_cousins)


#### Part 4: Backward Chaining #########################################

# Import additional methods for backchaining
from production import PASS, FAIL, match, populate, simplify, variables

def backchain_to_goal_tree(rules, hypothesis):
    """
    Takes a hypothesis (string) and a list of rules (list
    of IF objects), returning an AND/OR tree representing the
    backchain of possible statements we may need to test
    to determine if this hypothesis is reachable or not.

    This method should return an AND/OR tree, that is, an
    AND or OR object, whose constituents are the subgoals that
    need to be tested. The leaves of this tree should be strings
    (possibly with unbound variables), *not* AND or OR objects.
    Make sure to use simplify(...) to flatten trees where appropriate.
    """
    
    #how to maintain list while recursing
    
    x = OR(hypothesis)

    for rule in rules: # go through each rule
        binding = match(rule.consequent(), hypothesis) # get binding result from rule consequent and hypothesis
        
        
        if binding is not None: # case that there is a match
            if isinstance(rule.antecedent(), AND) == True: # check if antecedent is AND
                subtree = []
                for statement in rule.antecedent(): # loop over statements in antecedent # create another list
                    new_hypo = populate(statement, binding)
#                    subtree.append(new_hypo)
                    subtree.append(backchain_to_goal_tree(rules, new_hypo))
                
                x.append(AND(subtree))
                    #x.append(AND(populate(statement, binding), backchain_to_goal_tree(rules, populate(statement, binding)))) # recurse on each statement and attach to AND node
            elif isinstance(rule.antecedent(), OR) == True: # check if antecedent is OR
                subtree = []
                for statement in rule.antecedent(): # loop over statements in antecedent
                    new_hypo = populate(statement, binding)
#                    subtree.append(new_hypo)
                    subtree.append(backchain_to_goal_tree(rules, new_hypo))
                    #x.append(OR(populate(statement, binding), backchain_to_goal_tree(rules, populate(statement, binding)))) # recurse on each statement and attach to OR node
                x.append(OR(subtree))
            else: # antecedent is a string
                new_hypo =  populate(rule.antecedent(), binding)
                x.append(new_hypo)
                x.append(backchain_to_goal_tree(rules, new_hypo)) # recurse on statement and attach to OR node
        
        #elif rule == rules[-1]: # no handling of {}
            #return OR(hypothesis)
            
        #else: # if binding returns None
            #x.append(OR(hypothesis)) # return hypothesis in OR object, clean up with simplify
            
    return simplify(x)
    
        

# Uncomment this to test out your backward chainer:
#pretty_goal_tree(backchain_to_goal_tree(zookeeper_rules, 'opus is a penguin'))


#### Survey #########################################

NAME = 'Allison Serio'
COLLABORATORS = 'Sara Sime, Andrea Garcia'
HOW_MANY_HOURS_THIS_LAB_TOOK = 4
WHAT_I_FOUND_INTERESTING = 'I thought the reasoning for the self rule was interesting'
WHAT_I_FOUND_BORING = 'Learning how to use the API was a pain'
SUGGESTIONS = None


###########################################################
### Ignore everything below this line; for testing only ###
###########################################################

# The following lines are used in the tester. DO NOT CHANGE!
print("(Doing forward chaining. This may take a minute.)")
transitive_rule_poker = forward_chain([transitive_rule], poker_data)
transitive_rule_abc = forward_chain([transitive_rule], abc_data)
transitive_rule_minecraft = forward_chain([transitive_rule], minecraft_data)
family_rules_simpsons = forward_chain(family_rules, simpsons_data)
family_rules_black = forward_chain(family_rules, black_data)
family_rules_sibling = forward_chain(family_rules, sibling_test_data)
family_rules_grandparent = forward_chain(family_rules, grandparent_test_data)
family_rules_anonymous_family = forward_chain(family_rules, anonymous_family_test_data)
