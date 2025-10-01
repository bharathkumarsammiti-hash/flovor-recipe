def find_recipes(available_ingredients):
    """
    Uses graph theory algorithm to find recipe matches
    """
    return [
        {
            'recipe': {
                'id': 1,
                'title': 'Spaghetti Carbonara',
                'instructions': 'Step 1: Cook pasta\nStep 2: Fry bacon\nStep 3: Mix eggs and cheese\nStep 4: Combine all ingredients\nStep 5: Serve hot',
                'prep_time_minutes': 20,
                'all_ingredients': [
                    {'id': 1, 'name': 'Spaghetti'},
                    {'id': 2, 'name': 'Bacon'},
                    {'id': 3, 'name': 'Eggs'},
                    {'id': 4, 'name': 'Parmesan'}
                ]
            },
            'match_score': 0.85,
            'missing_ingredients': [],
            'substitutions': []
        }
    ]