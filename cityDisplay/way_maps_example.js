var ways = {
    "nodes": [
        {
            "name": "a",
            "type": "road",
            "start": {
                "x": 0,
                "y": 0
            },
            "end": {
                "x": 0,
                "y": 10
            },
            "walkable": true,
            "driveable": true,
            "bikeable": true
        },
        {
            "name": "b",
            "type": "road",
            "start": {
                "x": 0,
                "y": 5
            },
            "end": {
                "x": 5,
                "y": 5
            },
            "walkable": true,
            "driveable": true,
            "bikeable": true
        },
        {
            "name": "c",
            "type": "road",
            "start": {
                "x": 0,
                "y": 8
            },
            "end": {
                "x": 5,
                "y": 8
            },
            "walkable": true,
            "driveable": true,
            "bikeable": true
        },
        {
            "name": "d",
            "type": "road",
            "start": {
                "x": 5,
                "y": 0
            },
            "end": {
                "x": 5,
                "y": 8
            },
            "walkable": true,
            "driveable": true,
            "bikeable": true
        }
    ],
    "roads": [
        {
            "road": "a",
            "neighbors": [
                {"name": "b", "x": 0, "y": 5},
                {"name": "c", "x": 0, "y": 8}
            ]
        },
        {
            "road": "b",
            "neighbors": [
                {"name": "a", "x": 0, "y": 5},
                {"name": "d", "x": 5, "y": 5}
            ]
        },
        {
            "road": "c",
            "neighbors": [
                {"name": "a", "x": 0, "y": 8},
                {"name": "d", "x": 5, "y": 8}
            ]
        },
        {
            "road": "d",
            "neighbors": [
                {"name": "b", "x": 5, "y": 5},
                {"name": "c", "x": 5, "y": 8}
            ]
        }
    ]
}