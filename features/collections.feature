@collections
Feature: User Collections

    Users want to be able to view a set of pipelines that they most care about. These
    pipelines can be grouped into collections that these users own and maintain.

    Collections can be modified to include and exclude pipelines over their lifetimes.
    These collections can also be shared between users, such as teammates sharing
    collections they're responsible for.

    Rules:
        - Collections are unique by name and owner

    Background:
        Given an existing repository with these users and permissions:
            | name          | permission  |
            | calvin        | admin       |
#            | miss wormwood | no access   |
        And an existing pipeline with that repository

    Scenario: Create New Collection
        And "calvin" is logged in
        When they create a new collection "myCollection" with that pipeline
        Then they can see that collection
        And the collection contains that pipeline

    Scenario: Update Existing Collection
        And "calvin" is logged in
        When they create a new collection "myCollection"
        Then they can see that collection
        And the collection is empty
        When they update the collection "myCollection" with that pipeline
        Then they can see that collection
        And the collection contains that pipeline

    Scenario: Listing A User's Collection
        And "calvin" is logged in
        And they have a collection "myCollection"
        And they have a collection "anotherCollection"
        When they fetch all their collections
        Then they can see those collections

    Scenario: Deleting A Collection
        And "calvin" is logged in
        And they have a collection "myCollection"
        When they delete that collection
        Then that collection no longer exists
        And that pipeline still exists

    Scenario: Collections Are Unique
        And "calvin" is logged in
        And they have a collection "myCollection"
        When they create another collection with the same name "myCollection"
        Then they receive an error regarding unique collections
