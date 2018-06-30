module Main exposing (..)

import Html exposing (Html, text, div, a, footer, h1, img, span, br, ul, li)
import Http
import Json.Decode exposing (list, string, bool)
import Markdown


type Msg
    = GotDisplayNames (List DisplayName)
    | GotError Http.Error


type alias Model =
    { displayNames : List DisplayName
    , error : String
    }

type alias ApiResponse =
    { success : Bool
    , data : List DisplayName
    }


type alias DisplayName =
  { name: String }


model : Model
model =
    { displayNames = []
    , error = ""
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotDisplayNames displayNames ->
            ( { model | displayNames = displayNames }, Cmd.none )

        GotError error ->
            ( { model | error = toString error }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "What are Ken Wheeler's display names on Twitter?" ]
        , text "Since 2018-06-27"
        , br [] []
        , displayNamesView model.displayNames
        , br [] []
        , text model.error
        , footer [] [ footerView ]
        ]


displayNamesView : List DisplayName -> Html msg
displayNamesView displayNames =
    displayNames
        |> List.reverse
        |> List.map displayNameView
        |> ul []


displayNameView : DisplayName -> Html msg
displayNameView displayName =
    li [] [ text displayName.name ]


footerView : Html msg
footerView =
    Markdown.toHtml [] """
Built by [0lpeh](https://twitter.com/0lpeh).
Repository available at [GitHub](https://github.com/olpeh/ken-wheeler-aka)
"""


init : ( Model, Cmd Msg )
init =
    ( model
    , Http.send handler (Http.get "https://ken-wheeler-aka.herokuapp.com/api/aka/ken_wheeler" decoder)
    )


decoder : Json.Decode.Decoder ApiResponse
decoder =
    Json.Decode.map2 ApiResponse
        (Json.Decode.at [ "success" ] bool)
        (Json.Decode.at [ "data" ] (list displayNameDecoder))


displayNameDecoder : Json.Decode.Decoder DisplayName
displayNameDecoder =
  Json.Decode.map DisplayName
    (Json.Decode.field "name" Json.Decode.string)


handler : Result Http.Error ApiResponse -> Msg
handler result =
    case result of
        Ok apiResponse ->
            GotDisplayNames apiResponse.data

        Err error ->
            GotError error


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
